import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DebugPage() {
  const user = await requireDbUser();

  // Query full user with profile includes
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      providerProfile: true,
      customerProfile: true,
    },
  });

  if (!fullUser) {
    return <div>User not found in database</div>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Debug: User Info</h1>
      
      <h2>Basic Info</h2>
      <ul>
        <li><strong>ID:</strong> {fullUser.id}</li>
        <li><strong>Email:</strong> {fullUser.email}</li>
        <li><strong>Full Name:</strong> {fullUser.fullName}</li>
        <li><strong>Role:</strong> {fullUser.role}</li>
        <li><strong>Created:</strong> {fullUser.createdAt.toISOString()}</li>
      </ul>

      <h2>Profiles</h2>
      <ul>
        <li>
          <strong>Provider Profile:</strong>{" "}
          {fullUser.providerProfile ? "✅ EXISTS" : "❌ NOT FOUND"}
        </li>
        <li>
          <strong>Customer Profile:</strong>{" "}
          {fullUser.customerProfile ? "✅ EXISTS" : "❌ NOT FOUND"}
        </li>
      </ul>

      {fullUser.providerProfile && (
        <>
          <h2>Provider Profile Details</h2>
          <ul>
            <li><strong>Display Name:</strong> {fullUser.providerProfile.displayName || "N/A"}</li>
            <li><strong>Company Name:</strong> {fullUser.providerProfile.companyName || "N/A"}</li>
            <li><strong>Verification Status:</strong> {fullUser.providerProfile.verificationStatus}</li>
          </ul>
        </>
      )}

      {fullUser.customerProfile && (
        <>
          <h2>Customer Profile Details</h2>
          <ul>
            <li><strong>ID:</strong> {fullUser.customerProfile.id}</li>
          </ul>
        </>
      )}
    </div>
  );
}
