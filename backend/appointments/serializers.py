from rest_framework import serializers
from .models import Appointment, Doctor, DoctorWeeklyAvailability

class DoctorWeeklyAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorWeeklyAvailability
        fields = ['id', 'doctor', 'weekday', 'start_time', 'end_time']
        read_only_fields = ['id', 'doctor']


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'bio', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.filter(is_active=True))

    class Meta:
        model = Appointment
        fields = [
            'id',
            'doctor',
            'doctor_detail',
            'user',
            'title',
            'patient_name',
            'patient_email',
            'patient_phone',
            'reason',
            'description',
            'scheduled_at',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'status', 'created_at']
