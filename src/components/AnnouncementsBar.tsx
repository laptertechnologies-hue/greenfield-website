import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import type { Announcement } from '../utils/api';

const priorityColor: Record<string, string> = {
  urgent: '#e53e3e',
  normal: 'var(--primary-green)',
  info:   '#3182ce',
};
const priorityIcon: Record<string, string> = {
  urgent: 'fa-exclamation-circle',
  normal: 'fa-bullhorn',
  info:   'fa-info-circle',
};

export const AnnouncementsBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnnouncements()
      .then(data => setAnnouncements(data))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || announcements.length === 0) return null;

  return (
    <section className="announcements-section">
      <div className="announcements-header">
        <i className="fas fa-bell" />
        <h2>Announcements &amp; Notices</h2>
      </div>
      <div className="announcements-grid">
        {announcements.map(ann => (
          <div
            key={ann.id}
            className={`announcement-card priority-${ann.priority}`}
            style={{ borderLeftColor: priorityColor[ann.priority] || '#666' }}
          >
            <div className="announcement-card-header">
              <i
                className={`fas ${priorityIcon[ann.priority] || 'fa-bullhorn'}`}
                style={{ color: priorityColor[ann.priority] }}
              />
              <span
                className="announcement-badge"
                style={{ background: priorityColor[ann.priority] }}
              >
                {ann.priority === 'urgent' ? '🔴 Urgent' : ann.priority === 'info' ? 'ℹ️ Info' : '📢 Notice'}
              </span>
              <time className="announcement-date">
                {new Date(ann.published_at).toLocaleDateString('en-UG', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </time>
            </div>
            <h3>{ann.title}</h3>
            {ann.content && <p>{ann.content}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};
