# instructions from
# https://stackoverflow.com/questions/62525295/how-to-use-python-to-schedule-tasks-in-a-django-application/62525730#62525730

from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
import sys
from django.utils import timezone
from datetime import timedelta

from .models import Session


def delete_expired_sessions():
    time_to_select = timezone.now() - timedelta(hours = 1)
    # delete sessions that expired 1 hour ago and before
    expired_sessions = Session.objects.filter(is_active=False, timestamp__lte=time_to_select)
    if expired_sessions:
        expired_sessions.delete()
    
    # set as inactive the session that started 1 hour ago and before
    sessions_to_deactivate = Session.objects.filter(is_active=True, timestamp__lte=time_to_select)
    if sessions_to_deactivate:
        sessions_to_deactivate.update(is_active = False)


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")
    # run this job every 1 hour
    scheduler.add_job(delete_expired_sessions, 'interval', minutes=60, name='clean_sessions', jobstore='default', replace_existing=True, id='clean_sessions', coalesce=True)
    register_events(scheduler)
