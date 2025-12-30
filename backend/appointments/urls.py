from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, DoctorViewSet, DoctorWeeklyAvailabilityViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'doctors', DoctorViewSet, basename='doctors')

urlpatterns = [
    path(
        'doctors/<int:doctor_pk>/availability/',
        DoctorWeeklyAvailabilityViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='doctor-availability-list',
    ),
    path(
        'doctors/<int:doctor_pk>/availability/<int:pk>/',
        DoctorWeeklyAvailabilityViewSet.as_view(
            {'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}
        ),
        name='doctor-availability-detail',
    ),
    path('', include(router.urls)),
]
