import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
 
const ReviewScreen = ({ onBack, onSubmit, isSaving }) => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      padding: 48,
      height: "100%",
      width: "100%",
      textAlign: "left",
      boxSizing: "border-box",
      overflow: "auto",
    },
    title: {
      fontSize: 24,
      fontWeight: 400,
      color: "#111827",
      marginBottom: 16,
    },
    overviewSection: {
      width: "100%",
      marginBottom: 32,
      padding: 24,
      background: "#f5f5f5",
      borderRadius: 8,
    },
    overviewGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 16,
      marginTop: 16,
    },
    overviewItem: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
    overviewLabel: {
      fontSize: 12,
      color: "#6b7280",
      fontWeight: 600,
    },
    overviewValue: {
      fontSize: 14,
      color: "#111827",
    },
    sectionsContainer: {
      width: "100%",
      marginBottom: 24,
    },
    sectionCard: {
      marginBottom: 16,
      border: "1px solid #d1d1d1",
      borderRadius: 8,
      overflow: "hidden",
      background: "#fff",
    },
    sectionHeader: {
      padding: 16,
      background: "#f5f5f5",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      userSelect: "none",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: "#111827",
    },
    sectionStats: {
      fontSize: 12,
      color: "#6b7280",
      marginLeft: 16,
    },
    sectionContent: {
      padding: 16,
      borderTop: "1px solid #d1d1d1",
    },
    questionItem: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottom: "1px solid #e5e7eb",
    },
    questionTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: "#111827",
      marginBottom: 8,
    },
    answerRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 8,
    },
    scoreBadge: {
      padding: "4px 12px",
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 600,
      color: "#fff",
    },
    description: {
      fontSize: 14,
      color: "#374151",
      marginTop: 8,
      fontStyle: "italic",
    },
    message: {
      fontSize: 14,
      color: "#616161",
      lineHeight: 1.6,
      marginBottom: 32,
    },
    buttonGroup: {
      display: "flex",
      gap: 12,
      justifyContent: "flex-end",
      width: "100%",
      marginTop: 32,
      paddingTop: 24,
      borderTop: "1px solid #d1d1d1",
    },
    buttonSecondary: {
      padding: "10px 24px",
      borderRadius: 4,
      border: "1px solid #D1D1D1",
      background: "#fff",
      color: "#111827",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "Segoe UI",
    },
    buttonPrimary: {
      padding: "10px 24px",
      borderRadius: 4,
      border: "none",
      background: "#636F9E",
      color: "#fff",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "Segoe UI",
    },
  };
 
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>One last step...</h1>
     
      <p style={styles.message}>
        You've completed filling in the form.
        <br /><br />
        If you are comfortable with your entries, please click the "Submit" button to<br />
        complete the process.
      </p>
 
      <div style={styles.buttonGroup}>
        <button style={styles.buttonSecondary} onClick={onBack} disabled={isSaving}>
          Review or update your entries
        </button>
        <button style={styles.buttonPrimary} onClick={onSubmit} disabled={isSaving}>
          {isSaving ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};
 
export default ReviewScreen;