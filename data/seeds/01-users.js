const users = [
  { username: "admin", password: "$2y$08$Hc.Znbfb/vMu.wqYRk.GWOEb5cVEUG2.c.ZXwUItLTtF9P3OOc7AW", permission: 2 },
  { username: "user", password: "$2y$08$cPCgZA7I57XtXpabVpXL/eh61V7O2vKnRxwPxcgB/fch00HAtOy1C", permission: 1 },
  { username: "guest", password: "$2y$08$Oq4OrlecoAjwQJJbUv.cXOuRkvGg/yavgWXRKopGgEBm3zEbz58ue", permission: 0 },
];

exports.users = users;

exports.seed = function (knex) {
  return knex("users").insert(users);
};
