type itemHeaderProps = {
  name: string
  url: string
}

export class Constants {
  public static readonly projectsTable: string = 'projects-dev'
  public static readonly catalogsTable: string = 'catalogs-dev'
  public static readonly privateRoutes: itemHeaderProps[] = [
    {
      name: 'Progetti',
      url: '/projects',
    },
    {
      name: 'Cataloghi',
      url: '/catalogs',
    },
  ]
  public static readonly publicRoutes: itemHeaderProps[] = [
    {
      name: 'Dashboard',
      url: '/',
    },
  ]
}
