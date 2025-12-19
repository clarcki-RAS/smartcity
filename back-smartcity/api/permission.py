from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS

class AnonymousOrSuperuserPostOnly(BasePermission):
    """
    Autorise uniquement :
    - POST pour les utilisateurs anonymes
    - POST pour les superusers
    - Bloquer GET, PATCH, DELETE pour les anonymes

    """
    def has_permission(self, request, view):
        if request.method == "POST":
            return not request.user.is_authenticated or request.user.is_superuser
        # Bloquer GET, PATCH, DELETE pour les anonymes
        if not request.user.is_authenticated:
            return False
        return True  # Authenticated users peuvent accéder aux autres méthodes

class OnlySuperuserGet(BasePermission):
    """
    Autorise uniquement les superusers à effectuer des requêtes GET.
    """
    def has_permission(self, request, view):
        if request.method == "GET":
            return request.user.is_superuser
        return True  # Autoriser toutes les autres méthodes pour les utilisateurs authentifiés
class IsOwnerOrSuperUser(BasePermission):
    """
    Permission qui permet aux superusers d'accéder à tous les objets,
    et les utilisateurs authentifiés accèdent uniquement à leurs propres objets.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    def has_object_permission(self, request,view, obj):
        if request.user.is_superuser:
            return True
        elif view.basename =='image':
            return obj.signalement.user == request.user
        else:
            return obj.user == request.user