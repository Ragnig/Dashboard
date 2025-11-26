import React, { useState } from "react";

const ReviewScreen = ({ onBack, onSubmit, isSaving, sections, answers, overview }) => {
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getScoreLabel = (score) => {
    const labels = {
      0: "No evidence (0)",
      1: "Watchful waiting/prevention (1)",
      2: "Action (2)",
      3: "Immediate action (3)"
    };
    return labels[score] || `Score: ${score}`;
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      textAlign: "left",
      boxSizing: "border-box",
      overflow: "hidden",
    },
    header: {
      padding: "32px 48px",
      borderBottom: "1px solid #d1d1d1",
      background: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: 400,
      color: "#111827",
      marginBottom: 12,
    },
    message: {
      fontSize: 14,
      color: "#616161",
      lineHeight: 1.6,
      marginBottom: 0,
    },
    scrollContent: {
      flex: 1,
      overflowY: "auto",
      padding: "24px 48px",
      background: "#f5f5f5",
    },
    overviewSection: {
      background: "#fff",
      borderRadius: 4,
      padding: 24,
      marginBottom: 24,
      border: "1px solid #d1d1d1",
      boxShadow: "0 1px 6px rgba(16,24,40,0.06)",
    },
    overviewTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: "#111827",
      marginBottom: 16,
    },
    overviewGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: 16,
    },
    overviewItem: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
    overviewLabel: {
      fontSize: 12,
      color: "#6b7280",
      fontWeight: 500,
    },
    overviewValue: {
      fontSize: 14,
      color: "#111827",
    },
    sectionCard: {
      background: "#fff",
      borderRadius: 4,
      marginBottom: 16,
      border: "1px solid #d1d1d1",
      boxShadow: "0 1px 6px rgba(16,24,40,0.06)",
      overflow: "hidden",
    },
    sectionHeader: {
      padding: "16px 20px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#fff",
      borderBottom: "1px solid #d1d1d1",
      transition: "background 0.2s",
    },
    sectionHeaderHover: {
      background: "#f5f5f5",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: "#111827",
      margin: 0,
    },
    sectionStats: {
      fontSize: 13,
      color: "#616161",
      display: "flex",
      alignItems: "center",
      gap: 16,
    },
    chevron: {
      fontSize: 20,
      color: "#9ca3af",
      transition: "transform 0.2s",
    },
    chevronExpanded: {
      transform: "rotate(180deg)",
    },
    questionsContainer: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    questionItem: {
      borderLeft: "3px solid #636F9E",
      paddingLeft: 16,
      paddingBottom: 12,
    },
    questionText: {
      fontSize: 14,
      color: "#111827",
      fontWeight: 500,
      marginBottom: 8,
    },
    answerRow: {
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      marginTop: 4,
    },
    answerItem: {
      fontSize: 13,
      color: "#374151",
    },
    answerLabel: {
      color: "#6B7280",
      fontWeight: 500,
    },
    scoreBadge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 500,
    },
    footer: {
      padding: "20px 48px",
      borderTop: "1px solid #d1d1d1",
      background: "#fff",
    },
    buttonGroup: {
      display: "flex",
      gap: 12,
      justifyContent: "flex-end",
    },
    buttonSecondary: {
      padding: "10px 24px",
      borderRadius: 8,
      border: "1px solid #d1d5db",
      background: "#fff",
      color: "#111827",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "Segoe UI",
    },
    buttonPrimary: {
      padding: "10px 24px",
      borderRadius: 8,
      border: "1px solid #636F9E",
      background: "#636F9E",
      color: "#fff",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "Segoe UI",
    },
  };

  const getScoreBadgeStyle = (score) => {
    const baseStyle = { ...styles.scoreBadge };
    if (score === 0) {
      return { ...baseStyle, background: "#dcfce7", color: "#166534" };
    } else if (score === 1) {
      return { ...baseStyle, background: "#fef3c7", color: "#92400e" };
    } else if (score === 2) {
      return { ...baseStyle, background: "#fed7aa", color: "#9a3412" };
    } else if (score === 3) {
      return { ...baseStyle, background: "#fee2e2", color: "#991b1b" };
    }
    return { ...baseStyle, background: "#e5e7eb", color: "#374151" };
  };

  const getSectionStats = (section) => {
    const answered = section.rows.filter(row => answers[row.id]).length;
    return `${answered}/${section.rows.length} answered`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Review Your Assessment</h1>
        <p style={styles.message}>
          Review all sections and answers below. Click on any section to expand/collapse details.
        </p>
      </div>

      {/* Scrollable Content */}
      <div style={styles.scrollContent}>
        {/* Overview Information */}
        {overview && (
          <div style={styles.overviewSection}>
            <div style={styles.overviewTitle}>Overview Information</div>
            <div style={styles.overviewGrid}>
              {overview.caseId && (
                <div style={styles.overviewItem}>
                  <span style={styles.overviewLabel}>Case ID</span>
                  <span style={styles.overviewValue}>{overview.caseId}</span>
                </div>
              )}
              {overview.caseName && (
                <div style={styles.overviewItem}>
                  <span style={styles.overviewLabel}>Case Name</span>
                  <span style={styles.overviewValue}>{overview.caseName}</span>
                </div>
              )}
              {overview.personId && (
                <div style={styles.overviewItem}>
                  <span style={styles.overviewLabel}>Person ID</span>
                  <span style={styles.overviewValue}>{overview.personId}</span>
                </div>
              )}
              {overview.memberName && (
                <div style={styles.overviewItem}>
                  <span style={styles.overviewLabel}>Member Name</span>
                  <span style={styles.overviewValue}>{overview.memberName}</span>
                </div>
              )}
              {overview.memberDob && (
                <div style={styles.overviewItem}>
                  <span style={styles.overviewLabel}>Date of Birth</span>
                  <span style={styles.overviewValue}>{overview.memberDob}</span>
                </div>
              )}
              {overview.memberRole && (
                <div style={styles.overviewItem}>
                  <span style={styles.overviewLabel}>Member Role</span>
                  <span style={styles.overviewValue}>{overview.memberRole}</span>
                </div>
              )}
              {overview.workerName && (
                <div style={styles.overviewItem}>
                  <span style={styles.overviewLabel}>Worker Name</span>
                  <span style={styles.overviewValue}>{overview.workerName}</span>
                </div>
              )}
              {overview.dateOfAssessment && (
                <div style={styles.overviewItem}>
                  <span style={styles.overviewLabel}>Date of Assessment</span>
                  <span style={styles.overviewValue}>{overview.dateOfAssessment}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sections */}
        {sections && sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <div key={section.id} style={styles.sectionCard}>
              <div
                style={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
              >
                <div>
                  <h3 style={styles.sectionTitle}>{section.title}</h3>
                  <div style={styles.sectionStats}>
                    <span>{getSectionStats(section)}</span>
                  </div>
                </div>
                <span style={{
                  ...styles.chevron,
                  ...(isExpanded ? styles.chevronExpanded : {})
                }}>
                  ▼
                </span>
              </div>

              {isExpanded && (
                <div style={styles.questionsContainer}>
                  {section.rows.map((row) => {
                    const answer = answers[row.id];
                    if (!answer) return null;

                    return (
                      <div key={row.id} style={styles.questionItem}>
                        <div style={styles.questionText}>{row.name}</div>
                        <div style={styles.answerRow}>
                          {answer.score !== undefined && answer.score !== null && (
                            <span style={getScoreBadgeStyle(answer.score)}>
                              {getScoreLabel(answer.score)}
                            </span>
                          )}
                          {answer.unk && (
                            <span style={styles.answerItem}>
                              <span style={styles.answerLabel}>Unknown</span>
                            </span>
                          )}
                          {answer.na && (
                            <span style={styles.answerItem}>
                              <span style={styles.answerLabel}>Not Applicable</span>
                            </span>
                          )}
                        </div>
                        {answer.description && (
                          <div style={{ ...styles.answerItem, marginTop: 8 }}>
                            <span style={styles.answerLabel}>Notes: </span>
                            {answer.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with Buttons */}
      <div style={styles.footer}>
        <div style={styles.buttonGroup}>
          <button style={styles.buttonSecondary} onClick={onBack} disabled={isSaving}>
            Go Back & Edit
          </button>
          <button style={styles.buttonPrimary} onClick={onSubmit} disabled={isSaving}>
            {isSaving ? "Submitting..." : "Submit Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
