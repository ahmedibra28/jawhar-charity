const roles = [
  {
    _id: '5e0af1c63b6482125c1b22cb',
    name: 'Super Admin',
    description:
      'Super Admins can access and manage all features and settings.',
    type: 'SUPER_ADMIN',
  },
  {
    _id: '5e0af1c63b6482125c1b44cb',
    name: 'Authenticated',
    description: 'Default role given to authenticated user.',
    type: 'AUTHENTICATED',
  },
]

const users = {
  _id: '5063114bd386d8fadbd6b00a',
  name: 'Ahmed Ibrahim',
  email: 'info@ahmedibra.com',
  password: '123456',
  confirmed: true,
  blocked: false,
}

const profile = {
  _id: '5063114bd386d8fadbd6b00b',
  mobile: 252615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmaat19.png',
  bio: 'Full Stack Developer',
}

const sort = {
  hidden: 0,
  profile: 1,
  admin: 2,
  normal: 3,
  report: 4,
}

const clientPermissions = [
  {
    _id: '637e0261fadbdf65bba856b6',
    name: 'Home',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    _id: '637e0261fadbdf65bba856b7',
    name: 'Users',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    _id: '637e0261fadbdf65bba856b8',
    name: 'Roles',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    _id: '637e0261fadbdf65bba856b9',
    name: 'Profile',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    _id: '637e0261fadbdf65bba856bb',
    name: 'Permissions',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    _id: '637e0261fadbdf65bba856ba',
    name: 'Client Permissions',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
  {
    _id: '637e0261fadbdf65bba856bc',
    name: 'User Roles',
    path: '/admin/user-roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Roles page',
  },
  {
    _id: '637e0261fadbdf65bba856bd',
    name: 'User Profiles',
    path: '/admin/user-profiles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Profiles page',
  },

  {
    _id: '637e0261fadbdf65bba855bb',
    name: 'Donors',
    path: '/donors',
    menu: 'normal',
    sort: sort.normal,
    description: 'Donors page',
  },
  {
    _id: '637e0261fadddf65bba85555',
    name: 'Receipts',
    path: '/receipts',
    menu: 'normal',
    sort: sort.normal,
    description: 'Receipts page',
  },
  {
    _id: '637e0261fadddf65bba85bbb',
    name: 'Expenses',
    path: '/expenses',
    menu: 'normal',
    sort: sort.normal,
    description: 'Expenses page',
  },
  {
    _id: '637e0261fadddf65baa85bbb',
    name: 'Donor Report',
    path: '/reports/donor',
    menu: 'report',
    sort: sort.report,
    description: 'Donor Report page',
  },
  {
    _id: '637e0261fadddf65baa8bbbb',
    name: 'Account Report',
    path: '/reports/account',
    menu: 'report',
    sort: sort.report,
    description: 'Account Report page',
  },
  {
    _id: '677e0261fadddf65baa8bbbb',
    name: 'Payment Report',
    path: '/reports/payment',
    menu: 'report',
    sort: sort.report,
    description: 'Payment Report page',
  },
]

const permissions = [
  // Users
  {
    _id: '637e01fbfadbdf65bba855e2',
    description: 'Users',
    route: '/api/auth/users',
    name: 'Users',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e3',
    description: 'User By Id',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e4',
    description: 'User',
    route: '/api/auth/users',
    name: 'Users',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855e6',
    description: 'User',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855e7',
    description: 'User',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'DELETE',
  },

  //   User Profile
  {
    _id: '637e01fbfadbdf65bba855e5',
    description: 'Profiles',
    route: '/api/auth/user-profiles',
    name: 'User Profiles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e8',
    description: 'Profile',
    route: '/api/auth/profile',
    name: 'User Profile',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e9',
    description: 'Profile',
    route: '/api/auth/profile/:id',
    name: 'User Profile',
    method: 'PUT',
  },

  //   Role
  {
    _id: '637e01fbfadbdf65bba855ea',
    description: 'Roles',
    route: '/api/auth/roles',
    name: 'Roles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855eb',
    description: 'Role',
    route: '/api/auth/roles',
    name: 'Roles',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855ec',
    description: 'Role',
    route: '/api/auth/roles/:id',
    name: 'Roles',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855ed',
    description: 'Role',
    route: '/api/auth/roles/:id',
    name: 'Roles',
    method: 'DELETE',
  },

  //   Permission
  {
    _id: '637e01fbfadbdf65bba855ee',
    description: 'Permissions',
    route: '/api/auth/permissions',
    name: 'Permissions',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855ef',
    description: 'Permission',
    route: '/api/auth/permissions',
    name: 'Permissions',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f0',
    description: 'Permission',
    route: '/api/auth/permissions/:id',
    name: 'Permissions',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f1',
    description: 'Permission',
    route: '/api/auth/permissions/:id',
    name: 'Permissions',
    method: 'DELETE',
  },

  //   User Role
  {
    _id: '637e01fbfadbdf65bba855f2',
    description: 'User Roles',
    route: '/api/auth/user-roles',
    name: 'User Roles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855f4',
    description: 'User Role',
    route: '/api/auth/user-roles',
    name: 'User Roles',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f3',
    description: 'User Role',
    route: '/api/auth/user-roles/:id',
    name: 'User Roles',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f5',
    description: 'User Role',
    route: '/api/auth/user-roles/:id',
    name: 'User Roles',
    method: 'DELETE',
  },

  //   Client Permission
  {
    _id: '637e01fbfadbdf65bba855f6',
    description: 'Client Permissions',
    route: '/api/auth/client-permissions',
    name: 'ClientPermissions',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855f7',
    description: 'Client Permission',
    route: '/api/auth/client-permissions',
    name: 'ClientPermissions',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f8',
    description: 'Client Permission',
    route: '/api/auth/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f9',
    description: 'Client Permission',
    route: '/api/auth/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'DELETE',
  },

  //   Donor
  {
    _id: '63d6759ae2ed9febed01f1b0',
    description: 'Donors',
    route: '/api/donors',
    name: 'Donors',
    method: 'GET',
  },
  {
    _id: '63d6759ae2ed9febed01f1b1',
    description: 'Donor',
    route: '/api/donors',
    name: 'Donors',
    method: 'POST',
  },
  {
    _id: '63d6759ae2ed9febed01f1b2',
    description: 'Donor',
    route: '/api/donors/:id',
    name: 'Donors',
    method: 'PUT',
  },
  {
    _id: '63d6759ae2ed9febed01f1b3',
    description: 'Donor',
    route: '/api/donors/:id',
    name: 'Donors',
    method: 'DELETE',
  },

  //   Receipt
  {
    _id: '63d76f84cbfb58af17024472',
    description: 'Receipts',
    route: '/api/receipts',
    name: 'Receipts',
    method: 'GET',
  },
  {
    _id: '63d76f84cbfb58af17024473',
    description: 'Receipt',
    route: '/api/receipts',
    name: 'Receipts',
    method: 'POST',
  },
  {
    _id: '63d76f84cbfb58af17024474',
    description: 'Receipt',
    route: '/api/receipts/:id',
    name: 'Receipts',
    method: 'PUT',
  },
  {
    _id: '63d76f84cbfb58af17024475',
    description: 'Receipt',
    route: '/api/receipts/:id',
    name: 'Receipts',
    method: 'DELETE',
  },

  //   Expense
  {
    _id: '63d76f84cbfb58af17024476',
    description: 'Expenses',
    route: '/api/expenses',
    name: 'Expenses',
    method: 'GET',
  },
  {
    _id: '63d76f84cbfb58af17024477',
    description: 'Expense',
    route: '/api/expenses',
    name: 'Expenses',
    method: 'POST',
  },
  {
    _id: '63d76f84cbfb58af17024478',
    description: 'Expense',
    route: '/api/expenses/:id',
    name: 'Expenses',
    method: 'PUT',
  },
  {
    _id: '63d76f84cbfb58af17024479',
    description: 'Expense',
    route: '/api/expenses/:id',
    name: 'Expenses',
    method: 'DELETE',
  },

  // Report
  {
    _id: '63d76f84cbfb58af17024444',
    description: 'Donor report',
    route: '/api/reports/donor',
    name: 'Donor Report',
    method: 'POST',
  },
  {
    _id: '63d76f84cbfb58af17044444',
    description: 'Account report',
    route: '/api/reports/account',
    name: 'Account Report',
    method: 'POST',
  },
  {
    _id: '63d76f84cbfb58af17047774',
    description: 'Dashboard report',
    route: '/api/reports/dashboard',
    name: 'Dashboard Report',
    method: 'GET',
  },
  {
    _id: '63d76f84cbfb58af17047777',
    description: 'Payment report',
    route: '/api/reports/payment',
    name: 'Payment Report',
    method: 'POST',
  },
  {
    _id: '63d76884cbfb58af17047777',
    description: 'Payment generate',
    route: '/api/payment-generate',
    name: 'Payment Generate',
    method: 'POST',
  },
]

export { roles, users, profile, permissions, clientPermissions }
