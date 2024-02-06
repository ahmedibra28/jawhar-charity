const roles = [
  {
    id: 'HzdmUa40IctkReRd2Pofm',
    name: 'Super Admin',
    description:
      'Super Admins can access and manage all features and settings.',
    type: 'SUPER_ADMIN',
  },
  {
    id: 'a75POUlJzMDmaJtz0JCxp',
    name: 'Authenticated',
    description: 'Default role given to authenticated user.',
    type: 'AUTHENTICATED',
  },
  {
    id: 'a75POUlJzMDmaJtz0JCxs',
    name: 'Admin',
    description: 'Default role given to admin user.',
    type: 'ADMIN',
  },
  {
    id: 'a75POUlJzMDmaJtz0JCxk',
    name: 'Viewer',
    description: 'Default role given to viewer user.',
    type: 'VIEWER',
  },
]

const users = {
  id: 'e5cTUpLtGS7foE42nJuwp',
  name: 'Ahmed Ibrahim',
  email: 'info@ahmedibra.com',
  password: '123456',
  confirmed: true,
  blocked: false,
  mobile: 615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmedibra28.png',
  bio: 'Full Stack Developer',
}

const profile = {
  id: 'hMXCyzI2MLXNI6tQ-sU0i',
  mobile: 615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmedibra28.png',
  bio: 'Full Stack Developer',
}

const sort = {
  hidden: 0,
  profile: 1,
  admin: 2,
  normal: 3,
}

const clientPermissions = [
  {
    id: 'MZ4Qsx2e-g96eMw0X2qul',
    name: 'Home',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    id: 'IYN1EVSvUg0o5pAxgPEPi',
    name: 'Users',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    id: 'VFGo5W_hc3O85QCOouabO',
    name: 'Roles',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    id: 't-Snd86AW-TlIlMEDmYyt',
    name: 'Profile',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    id: 'eWpbNJ9LkTVO4BYyaO1mJ',
    name: 'Permissions',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC2',
    name: 'Client Permissions',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC3',
    name: 'Donors',
    path: '/donors',
    menu: 'normal',
    sort: sort.normal,
    description: 'Donors page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC4',
    name: 'Accounts',
    path: '/accounts',
    menu: 'normal',
    sort: sort.normal,
    description: 'Accounts page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC7',
    name: 'Account Transactions',
    path: '/reports/transactions/accounts/[id]',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Account transactions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaO10',
    name: 'Donor Transactions',
    path: '/reports/transactions/donors/[id]',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Donor transactions page',
  },
]

const permissions = [
  // Users
  {
    id: 'fCuAED2qkbOmWYmKsOa-_',
    description: 'Users',
    route: '/api/users',
    name: 'Users',
    method: 'GET',
  },
  {
    id: 'UzN2L6RQ_gUM0_JN4ALkB',
    description: 'User Client Permissions',
    route: '/api/users/:id',
    name: 'Users',
    method: 'GET',
  },
  {
    id: 'rqRYCpC0yytkColvHwY3C',
    description: 'User',
    route: '/api/users',
    name: 'Users',
    method: 'POST',
  },
  {
    id: 'xsei4vGvYpoXw3V0_Bgcy',
    description: 'User',
    route: '/api/users/:id',
    name: 'Users',
    method: 'PUT',
  },
  {
    id: '27vMGpNbQGLKtuaIsTAcF',
    description: 'User',
    route: '/api/users/:id',
    name: 'Users',
    method: 'DELETE',
  },

  //   Profile
  {
    id: 'Fyph8SxjGayAHr8g65Rie',
    description: 'Profile',
    route: '/api/profile',
    name: 'Profile',
    method: 'GET',
  },
  {
    id: 'LMG211l6gxRRkjAHPvhgw',
    description: 'Profile',
    route: '/api/profile/:id',
    name: 'Profile',
    method: 'PUT',
  },

  //   Role
  {
    id: '2xiakJtuDptmlP7fxgggo',
    description: 'Roles',
    route: '/api/roles',
    name: 'Roles',
    method: 'GET',
  },
  {
    id: 'HQ8Drbd0-KOMequqhQVuG',
    description: 'Role',
    route: '/api/roles',
    name: 'Roles',
    method: 'POST',
  },
  {
    id: 'GzrnbouFYGvGfvdAfbiZT',
    description: 'Role',
    route: '/api/roles/:id',
    name: 'Roles',
    method: 'PUT',
  },
  {
    id: 'KrZ76u2VUI9qICSJhsuW5',
    description: 'Role',
    route: '/api/roles/:id',
    name: 'Roles',
    method: 'DELETE',
  },

  //   Permission
  {
    id: '9P0mpbew9dYW4oF9cM-mO',
    description: 'Permissions',
    route: '/api/permissions',
    name: 'Permissions',
    method: 'GET',
  },
  {
    id: 'n0dw4GMpgiXfySbdlGhs0',
    description: 'Permission',
    route: '/api/permissions',
    name: 'Permissions',
    method: 'POST',
  },
  {
    id: 'tK5RgtYLe9yFNgF93m6TO',
    description: 'Permission',
    route: '/api/permissions/:id',
    name: 'Permissions',
    method: 'PUT',
  },
  {
    id: 'cn25W3-inLybNRkCMHgNC',
    description: 'Permission',
    route: '/api/permissions/:id',
    name: 'Permissions',
    method: 'DELETE',
  },

  //   Client Permission
  {
    id: 'X26iEN1J-LBaC4HlPsRgh',
    description: 'Client Permissions',
    route: '/api/client-permissions',
    name: 'ClientPermissions',
    method: 'GET',
  },
  {
    id: 'HRu69jNp0j4pJXs_cjCQ5',
    description: 'Client Permission',
    route: '/api/client-permissions',
    name: 'ClientPermissions',
    method: 'POST',
  },
  {
    id: 'X9ACZfrFX9CAl-2uPXyw9',
    description: 'Client Permission',
    route: '/api/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxA',
    description: 'Client Permission',
    route: '/api/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'DELETE',
  },
  //  Upload
  {
    id: 'YTU-o6vjJk4A-4uM8kgxM',
    description: 'Upload',
    route: '/api/uploads',
    name: 'Upload',
    method: 'POST',
  },

  //  Donors
  {
    id: 'YTU-o6vjJk4A-4uM8kgxN',
    description: 'Donors',
    route: '/api/donors',
    name: 'Donors',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxO',
    description: 'Donor',
    route: '/api/donors',
    name: 'Donors',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxP',
    description: 'Donor',
    route: '/api/donors/:id',
    name: 'Donors',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxQ',
    description: 'Donor',
    route: '/api/donors/:id',
    name: 'Donors',
    method: 'DELETE',
  },

  // Accounts
  {
    id: 'YTU-o6vjJk4A-4uM8kgxR',
    description: 'Accounts',
    route: '/api/accounts',
    name: 'Accounts',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxS',
    description: 'Account',
    route: '/api/accounts',
    name: 'Accounts',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxT',
    description: 'Account',
    route: '/api/accounts/:id',
    name: 'Accounts',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxU',
    description: 'Account',
    route: '/api/accounts/:id',
    name: 'Accounts',
    method: 'DELETE',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx2',
    description: 'Deposit',
    route: '/api/accounts/deposit/:id',
    name: 'Accounts',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx7',
    description: 'Expense',
    route: '/api/accounts/expense/:id',
    name: 'Accounts',
    method: 'PUT',
  },

  // Transaction
  {
    id: 'YTU-o6vjJk4A-4uM8kgx8',
    description: 'Account Transactions',
    route: '/api/reports/transactions/accounts/:id',
    name: 'Transactions',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx9',
    description: 'Donor Transactions',
    route: '/api/reports/transactions/donors/:id',
    name: 'Transactions',
    method: 'GET',
  },
]

export { roles, users, profile, permissions, clientPermissions }
