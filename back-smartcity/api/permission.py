from rest_framework.permissions import BasePermission


def is_admin_user(user):
    return bool(user and (user.is_superuser or getattr(user, "role", None) == "ADMIN"))


class AnonymousOrSuperuserPostOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            return not request.user.is_authenticated or is_admin_user(request.user)
        if not request.user.is_authenticated:
            return False
        return True


class OnlySuperuserGet(BasePermission):
    def has_permission(self, request, view):
        if request.method == "GET":
            return is_admin_user(request.user)
        return True


class IsOwnerOrSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if is_admin_user(request.user):
            return True
        if view.basename == 'image':
            return obj.signalement.user == request.user
        return obj.user == request.user
