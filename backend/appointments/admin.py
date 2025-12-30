from django.contrib import admin

from .models import Appointment, Doctor, DoctorWeeklyAvailability


class DoctorWeeklyAvailabilityInline(admin.TabularInline):
    model = DoctorWeeklyAvailability
    extra = 1


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'is_active', 'created_at')
    list_filter = ('is_active', 'specialization')
    search_fields = ('name', 'specialization')
    inlines = [DoctorWeeklyAvailabilityInline]


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('scheduled_at', 'doctor', 'patient_name', 'status', 'created_at')
    list_filter = ('status', 'doctor')
    search_fields = ('patient_name', 'patient_email', 'patient_phone', 'doctor__name')
    ordering = ('-scheduled_at',)


@admin.register(DoctorWeeklyAvailability)
class DoctorWeeklyAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'weekday', 'start_time', 'end_time')
    list_filter = ('weekday', 'doctor')
    ordering = ('doctor', 'weekday', 'start_time')
