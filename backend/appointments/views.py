from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Appointment, Doctor, DoctorWeeklyAvailability
from .serializers import (
    AppointmentSerializer,
    DoctorSerializer,
    DoctorWeeklyAvailabilitySerializer,
)

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_authenticated and request.user.is_staff:
            return True
        return obj.user_id == getattr(request.user, "id", None) and obj.user_id is not None

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.select_related('doctor', 'user').all()

    def get_queryset(self):
        if self.request.user and self.request.user.is_authenticated and self.request.user.is_staff:
            return self.queryset.order_by('-scheduled_at')
        if self.request.user and self.request.user.is_authenticated:
            return self.queryset.filter(user=self.request.user).order_by('-scheduled_at')
        return self.queryset.none()

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwner()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user and self.request.user.is_authenticated else None
        serializer.save(user=user)


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all().order_by('name')
    serializer_class = DoctorSerializer

    def get_queryset(self):
        qs = self.queryset
        if self.request.user and self.request.user.is_authenticated and self.request.user.is_staff:
            return qs
        return qs.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'available_slots']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['get'], url_path='available-slots', permission_classes=[permissions.AllowAny])
    def available_slots(self, request, pk=None):
        doctor = self.get_object()
        date_str = request.query_params.get('date')
        if not date_str:
            raise ValidationError({'date': 'date query param is required (YYYY-MM-DD).'})

        try:
            date_value = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            raise ValidationError({'date': 'Invalid date format. Use YYYY-MM-DD.'})

        weekday = date_value.weekday()
        availability = DoctorWeeklyAvailability.objects.filter(doctor=doctor, weekday=weekday).order_by('start_time')
        if not availability.exists():
            return Response({'doctor': doctor.id, 'date': date_str, 'slots': []})

        existing = Appointment.objects.filter(
            doctor=doctor,
            scheduled_at__date=date_value,
        ).exclude(status='cancelled')

        taken = set()
        for appt in existing:
            local_dt = timezone.localtime(appt.scheduled_at)
            taken.add(local_dt.strftime('%H:%M'))

        slot_minutes = 30
        slots = []
        for window in availability:
            start_dt = timezone.make_aware(datetime.combine(date_value, window.start_time))
            end_dt = timezone.make_aware(datetime.combine(date_value, window.end_time))
            current = start_dt
            while current + timedelta(minutes=slot_minutes) <= end_dt:
                label = timezone.localtime(current).strftime('%H:%M')
                if label not in taken:
                    slots.append(label)
                current += timedelta(minutes=slot_minutes)

        return Response({'doctor': doctor.id, 'date': date_str, 'slots': slots})


class DoctorWeeklyAvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorWeeklyAvailabilitySerializer

    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_pk')
        return DoctorWeeklyAvailability.objects.filter(doctor_id=doctor_id).order_by('weekday', 'start_time')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(doctor_id=self.kwargs.get('doctor_pk'))
