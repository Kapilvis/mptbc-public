import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import "./Profile.css";

const Profile = () => {
  const { authenticated: auth, user, logout: handleLogout } = useAuth();

  const profile = user?.profile ?? null;

  const lastLogin = profile?.iat
    ? new Date(profile.iat * 1000).toLocaleString()
    : "N/A";

  const userRole = Array.isArray(profile?.role)
    ? profile.role.join(", ")
    : profile?.role || "Main Administrator";

  const recentActivity = [
    {
      title: "Successful login",
      dateTime: lastLogin,
      status: "Success",
      tone: "success",
    },
    {
      title: "Session started",
      dateTime: lastLogin,
      status: "System",
      tone: "system",
    },
  ];

  if (auth === null) {
    return (
      <div className="profile-loader-wrapper">
        <div className="profile-loader">
          <div className="profile-loader-track" />
          <div className="profile-loader-spinner" />
        </div>
      </div>
    );
  }

  if (auth === false) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="profile-page">
      <div className="profile-top-grid">
        <section className="profile-avatar-card">
          <div className="profile-cover-pattern" />

          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              <img
                src={`${import.meta.env.BASE_URL}images/user/owner.jpg`}
                alt="Profile Avatar"
                className="profile-avatar-image"
                onError={(event) => {
                  event.currentTarget.src =
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                }}
              />
            </div>

            <span className="profile-online-status" />
          </div>

          <h2 className="profile-user-name">{profile?.name || "WCD User"}</h2>

          <span className="profile-user-role">{userRole}</span>

          <div className="profile-active-status">
            <span className="profile-active-dot" />
            <span>Active and Online</span>
          </div>

          <div className="profile-divider" />

          <div className="profile-stat-grid">
            <div className="profile-stat-card">
              <i className="pi pi-shield" />
              <strong>1</strong>
              <span>Roles</span>
            </div>

            <div className="profile-stat-card">
              <i className="pi pi-users" />
              <strong>24</strong>
              <span>Users Managed</span>
            </div>

            <div className="profile-stat-card">
              <i className="pi pi-building" />
              <strong>3</strong>
              <span>Directories</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="profile-signout-button"
          >
            <i className="pi pi-sign-out" />
            <span>Sign Out</span>
          </button>
        </section>

        <section className="profile-details-card">
          <div className="profile-section-heading">
            <span className="profile-section-icon-box">
              <i className="pi pi-id-card" />
            </span>

            <div>
              <h3>User Profile Information</h3>
              <span className="profile-section-accent" />
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail-card">
              <div className="profile-detail-icon">
                <i className="pi pi-user" />
              </div>

              <div className="profile-detail-content">
                <span className="profile-detail-label">Username</span>
                <strong className="profile-detail-value">
                  {profile?.name ?? "—"}
                </strong>
              </div>
            </div>

            <div className="profile-detail-card">
              <div className="profile-detail-icon">
                <i className="pi pi-envelope" />
              </div>

              <div className="profile-detail-content">
                <span className="profile-detail-label">Email Address</span>
                <strong className="profile-detail-value">
                  {profile?.email || "N/A"}
                </strong>
              </div>
            </div>

            <div className="profile-detail-card">
              <div className="profile-detail-icon">
                <i className="pi pi-clock" />
              </div>

              <div className="profile-detail-content">
                <span className="profile-detail-label">
                  Last Authentication
                </span>
                <strong className="profile-detail-value">{lastLogin}</strong>
              </div>
            </div>

            <div className="profile-detail-card">
              <div className="profile-detail-icon">
                <i className="pi pi-shield" />
              </div>

              <div className="profile-detail-content">
                <span className="profile-detail-label">Session Status</span>

                <span className="profile-session-status">
                  <span className="profile-session-dot" />
                  Active Secure Session
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="profile-bottom-grid">
        <section className="profile-support-card">
          <div className="profile-support-header">
            <div className="profile-support-title">
              <span className="profile-support-icon">
                <i className="pi pi-shield" />
              </span>

              <div>
                <h3>Account Security</h3>
                <p>
                  Your account is secured with strong access controls and active
                  monitoring.
                </p>
              </div>
            </div>

            <span className="profile-support-illustration">
              <i className="pi pi-lock" />
            </span>
          </div>

          <div className="profile-security-row">
            <span className="profile-security-status">
              <i className="pi pi-check-circle" />
            </span>

            <div>
              <strong>No security alerts</strong>
              <span>All systems are operating normally</span>
            </div>

            <i className="pi pi-angle-right profile-security-arrow" />
          </div>
        </section>

        <section className="profile-support-card">
          <div className="profile-activity-header">
            <div className="profile-support-title">
              <span className="profile-support-icon">
                <i className="pi pi-wave-pulse" />
              </span>

              <h3>Recent Activity</h3>
            </div>

            <button type="button" className="profile-view-all-button">
              View All
            </button>
          </div>

          <div className="profile-activity-list">
            {recentActivity.map((activity, index) => (
              <div
                key={`${activity.title}-${activity.status}`}
                className="profile-activity-row"
              >
                <span
                  className={`profile-activity-dot profile-activity-dot-${activity.tone}`}
                />

                <div className="profile-activity-content">
                  <strong>{activity.title}</strong>
                  <span>{activity.dateTime}</span>
                </div>

                <span
                  className={`profile-activity-badge profile-activity-badge-${activity.tone}`}
                >
                  {activity.status}
                </span>

                {index < recentActivity.length - 1 && (
                  <span className="profile-activity-line" />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
