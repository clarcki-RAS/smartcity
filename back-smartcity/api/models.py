from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices): 
        CIVIL='CIVIL', 'Civil'
        ADMIN='ADMIN', 'Admin'
    role = models.CharField(max_length=20, choices=Role,default=Role.CIVIL)
    def __str__(self):
        return f"{self.username} ({self.role})"
    
# --- Signalement ---
class Signalement(models.Model):
    STATUT_CHOICES = [
        ('PENDING', 'pending'),
        ('IN_PROGRESS', 'in progress'),
        ('RESOLVED', 'resolved'),
    ]
    description = models.TextField()
    localisation = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUT_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='signalements'
    )

    def __str__(self):
        return f"Signalement #{self.id} - {self.status}"

#--- Images
class Image(models.Model):
    signalement = models.ForeignKey(
        Signalement, 
        on_delete=models.CASCADE,
        related_name='images'
    )
    image_url = models.ImageField(upload_to='signalements/',blank=True,null=True) 

# --- Notification ---
class Notification(models.Model):
    destinataire = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    signalement = models.ForeignKey(
        Signalement,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )

    def __str__(self):
        return f"Notification à {self.destinataire.username} - {self.date.strftime('%Y-%m-%d %H:%M')}"

class MlModel(models.Model):
    version = models.CharField(max_length=20, null=True, blank=True)
    labels = models.CharField(max_length=20, null=True, blank=True)
    precision = models.IntegerField(null=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Model vesrion {self.version} de precision {self.precision}"
    
    
class Prediction(models.Model):
    model = models.ForeignKey(MlModel, null=True, blank=True, on_delete=models.CASCADE)
    signalement = models.ForeignKey(Signalement, null=True, blank=True, on_delete=models.CASCADE)
    label = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confidence = models.CharField(max_length=20, null=True, blank=True)
    