db.users.insertOne(
    {
    name: "admin",
    email: "admin@hilton.com",
    role: 'employee',
    password: "$2b$10$fR8q1aP7G6BfVPj7bUriP.K6yMnbzS43gpIHDuLu7qUwfHCNRqfIa",
    }
  )

  db.users.insertOne(
    {
    name: "guest",
    email: "guest@hilton.com",
    role: 'guest',
    password: "$2b$10$izHJuZyK4uKujeyQqUUMa.S.nzZ.zN6LoUJvtMX.KtiQsyg3I20xi",
    }
  )