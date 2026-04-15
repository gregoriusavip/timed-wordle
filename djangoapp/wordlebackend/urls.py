from django.contrib import admin
from django.urls import path
from wordlebackend import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/guess', views.guess_word, name='guess_word'),
    path('api/timeout', views.timeout_guess, name='timeout_guess'),
]
