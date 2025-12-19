class UserQuerysetMixin:
    """
    Restreint le queryset aux objets rattachés à l'utilisateur,
    sauf pour les superusers qui voient tout.
    """

   
    http_method_names=['get','post','patch','delete']

    def get_queryset(self):
        # récupérer le queryset de base défini dans le ViewSet
        qs = super().get_queryset()
        user = self.request.user

        if user.is_superuser:
            return qs  # superuser voit tout
        elif user.is_authenticated:
            filter_kwargs = {'user': user}
            return qs.filter(**filter_kwargs)
        else:
            # anonyme : aucun objet
            return qs.none()
