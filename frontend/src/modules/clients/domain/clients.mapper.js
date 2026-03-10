export function mapClients(clients = []) {
  return clients.map((c) => {
    const name = c.name ?? "";
    const initials = (name || "—")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x?.[0]?.toUpperCase())
      .join("");

    return {
      id: c.id,
      name,
      phoneNumber: c.phoneNumber ?? "",
      email: c.email ?? "",
      isGuest: !!c.isGuest,
      role: c.role ?? "client",
      initials,
      raw: c,
    };
  });
}