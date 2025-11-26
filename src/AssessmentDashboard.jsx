import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, CheckCircle, Clock, FileText, X, Search, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import './dashboard.css';
import FAREQuestionnaire from './FAREQuestionnaire';
import CANSForm from './CANSForm';
import ResidentialForm from './Residentialform';

export default function AssessmentDashboard() {
  const [assessments, setAssessments] = useState([]);
  const [activeForm, setActiveForm] = useState(null); // 'fare', 'cans', 'residential', or null
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showEmpty, setShowEmpty] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    loadAssessments();

    // Check URL hash for direct assessment links (from new tabs)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#assessment/')) {
      const parts = hash.split('/');
      if (parts.length >= 3) {
        const formType = parts[1]; // 'cans', 'fare', 'residential'
        const assessmentId = parts[2];
        
        console.log('🔗 Loading from URL hash:', formType, assessmentId);
        
        // Check localStorage first (for new tabs), then sessionStorage (for same tab)
        let savedDraftData = localStorage.getItem('currentAssessmentDraft') || sessionStorage.getItem('selectedDraft');
        if (savedDraftData) {
          try {
            const draftData = JSON.parse(savedDraftData);
            if (draftData.id === assessmentId) {
              setSelectedDraft(draftData);
              setActiveForm(formType);
              // Clear the localStorage temp data after using it
              localStorage.removeItem('currentAssessmentDraft');
              console.log('✅ Assessment loaded from URL hash');
              return;
            }
          } catch (error) {
            console.error('Failed to parse draft from URL:', error);
          }
        }
        
        // If not in localStorage/sessionStorage, try to load from localStorage assessments
        const stored = localStorage.getItem('assessments');
        if (stored) {
          try {
            const allAssessments = JSON.parse(stored);
            const assessment = allAssessments.find(a => a.id === assessmentId);
            if (assessment) {
              setSelectedDraft(assessment);
              setActiveForm(formType);
              console.log('✅ Assessment loaded from localStorage');
              return;
            }
          } catch (error) {
            console.error('Failed to load assessment from localStorage:', error);
          }
        }
      }
    }
    
    // Check for active form in sessionStorage (for page refresh recovery)
    const savedActiveForm = sessionStorage.getItem('activeForm');
    const savedDraftData = sessionStorage.getItem('selectedDraft');
    
    if (savedActiveForm && !hash.startsWith('#assessment/')) {
      setActiveForm(savedActiveForm);
      if (savedDraftData) {
        try {
          setSelectedDraft(JSON.parse(savedDraftData));
        } catch (error) {
          console.error('Failed to parse saved draft data:', error);
        }
      }
    }
  }, []);

  // Save activeForm to sessionStorage whenever it changes
  useEffect(() => {
    if (activeForm) {
      sessionStorage.setItem('activeForm', activeForm);
      if (selectedDraft) {
        sessionStorage.setItem('selectedDraft', JSON.stringify(selectedDraft));
        // Update URL hash for shareable/bookmarkable links
        window.location.hash = `#assessment/${activeForm}/${selectedDraft.id}`;
      }
    } else {
      // Clear when returning to dashboard
      sessionStorage.removeItem('activeForm');
      sessionStorage.removeItem('selectedDraft');
      window.location.hash = '';
    }
  }, [activeForm, selectedDraft]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterStatus, searchQuery]);

  // const loadAssessments = () => {
  //   try {
  //     const stored = localStorage.getItem('assessments');
  //     if (stored) {
  //       const parsed = JSON.parse(stored);
  //       setAssessments(parsed);
  //     } else {
  //       setAssessments([
  //         {
  //           id: '345968',
  //           caseId: '12345',
  //           type: 'F.A.R.E',
  //           status: 'Completed',
  //           createdOn: '08/10/2025, 09:30:15 AM',
  //           createdBy: 'John Smith'
  //         },
  //         {
  //           id: '789614',
  //           caseId: '23456',
  //           type: 'CANS',
  //           status: 'In-progress',
  //           createdOn: '11/09/2025, 02:45:22 PM',
  //           createdBy: 'Jane Doe'
  //         },
  //         // Add 10 more demo assessments here for testing pagination
  //         ...Array.from({ length: 10 }, (_, i) => ({
  //           id: `DEMO-${100000 + i}`,
  //           caseId: `CASE-${5000 + i}`,
  //           type: ['CANS', 'F.A.R.E', 'Residential'][i % 3],
  //           status: ['Completed', 'In-progress', 'Draft'][i % 3],
  //           createdOn: new Date(2025, 10, i + 1).toLocaleString('en-US'),
  //           createdBy: ['John Smith', 'Jane Doe', 'Bob Johnson'][i % 3]
  //         }))
  //       ]);
  //     }
      
  //   } catch (error) {
  //     console.error('Error loading assessments:', error);
  //   }
  // };

//   const loadAssessments = async () => {
//   try {
//     // 1️⃣ Fetch CANS from database
//     const cansResponse = await fetch("http://localhost:5000/api/basic-info");
//     const cansData = await cansResponse.json();

//     const dbCans = cansData.map((item) => {
//       const parsed = JSON.parse(item.SchemaJSON || "{}");

//       return {
//         id: item.ID,
//         caseId: parsed.overview?.caseId || "N/A",
//         type: "CANS",
//         status: item.Status === "complete" ? "Completed" : "Draft",
//         createdOn: item.Timestamp,
//         createdBy: "System",
//         overview: parsed.overview || {},
//         answers: parsed.answers || {},
//         data: parsed,
//       };
//     });

//     // 2️⃣ Load local FARE & Residential (ONLY these two)
//     let localForms = [];
//     const stored = localStorage.getItem("assessments");

//     if (stored) {
//       localForms = JSON.parse(stored).filter(
//         (form) => form.type !== "CANS" // remove local CANS
//       );
//     }

//     // 3️⃣ Merge final list → CANS(DB) + others(local)
//     const finalData = [...dbCans, ...localForms];

//     // 4️⃣ Set state
//     setAssessments(finalData);

//   } catch (err) {
//     console.error("Error loading assessments:", err);
//   }
// };


const loadAssessments = async () => {
  try {
    // Backend connectivity commented out - using localStorage only
    // // -------------------------------
    // // 1️⃣ Load CANS forms from Database (SQLite)
    // // -------------------------------
    // const cansRes = await fetch("http://localhost:5000/api/basic-info");
    // const cansData = await cansRes.json();

    // const dbCans = cansData.map((item) => {
    //   const parsed = JSON.parse(item.SchemaJSON || "{}");

    //   return {
    //     id: item.ID,
    //     caseId: parsed.overview?.caseId || "N/A",
    //     type: "CANS",
    //     status: item.Status === "complete" ? "Completed" : "Draft",
    //     createdOn: item.Timestamp,
    //     createdBy: "System",
    //     overview: parsed.overview || {},
    //     answers: parsed.answers || {},
    //     data: parsed
    //   };
    // });

    // -------------------------------
    // Load all forms from LocalStorage
    // -------------------------------
    let localForms = [];

    const stored = localStorage.getItem("assessments");
    if (stored) {
      localForms = JSON.parse(stored);
      // No filtering needed - all forms from localStorage
      // localForms = parsedLocal.filter((item) => item.type !== "CANS");
    }

    // -------------------------------
    // Set final results (localStorage only)
    // -------------------------------
    setAssessments(localForms);
    // const finalAssessments = [...dbCans, ...localForms];
    // setAssessments(finalAssessments);

  } catch (error) {
    console.error("Error loading assessments:", error);
  }
};

  const saveAssessment = (assessment) => {
    try {
      const updatedAssessments = [...assessments];
      const existingIndex = updatedAssessments.findIndex(a => a.id === assessment.id);
      
      if (existingIndex >= 0) {
        updatedAssessments[existingIndex] = assessment;
      } else {
        updatedAssessments.push(assessment);
      }
      
      setAssessments(updatedAssessments);
      localStorage.setItem('assessments', JSON.stringify(updatedAssessments));
      return true;
    } catch (error) {
      console.error('Error saving assessment:', error);
      return false;
    }
  };

  const handleCANSSave = (data) => {
    const assessmentId = data.id || `CANS-${Date.now()}`;
    
    const newAssessment = {
      id: assessmentId,
      caseId: data.caseId || data.overview?.caseId || 'N/A',
      type: 'CANS',
      createdBy: data.createdBy || 'Current User',
      status: data.status || 'In-progress',
      createdOn: new Date().toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      overview: data.overview,
      answers: data.answers,
      data: data
    };
    
    const saved = saveAssessment(newAssessment);
    
    if (saved) {
      // Show appropriate message based on status
      if (data.status === 'Completed') {
        alert('✅ CANS assessment submitted successfully!');
      } else {
        alert('✅ CANS assessment saved as draft!');
      }
      setActiveForm(null);
      setSelectedDraft(null);
      loadAssessments();
    } else {
      alert('Failed to save assessment. Please try again.');
    }
  };

  const handleFARESave = (data) => {
    const assessmentId = data.id || `FARE-${Date.now()}`;
    
    const newAssessment = {
      id: assessmentId,
      caseId: data.caseId || 'N/A',
      type: 'F.A.R.E',
      status: data.status || 'In-progress',
      createdBy: data.createdBy || 'Current User',
      createdOn: new Date().toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      overview: data.overview,
      answers: data.answers,
      data: data
    };
    
    const saved = saveAssessment(newAssessment);
    
    if (saved) {
      // Show appropriate message based on status
      if (data.status === 'Completed') {
        alert('✅ FARE assessment submitted successfully!');
      } else {
        alert('✅ FARE assessment saved as draft!');
      }
      setActiveForm(null);
      setSelectedDraft(null);
      loadAssessments();
    } else {
      alert('Failed to save assessment. Please try again.');
    }
  };

  const handleResidentialSave = (data) => {
    const assessmentId = data.id || `RES-${Date.now()}`;
    
    const newAssessment = {
      id: assessmentId,
      caseId: data.contract_number || 'N/A',
      type: 'Residential',
      status: data.status || 'In-progress',
      createdBy: data.createdBy || 'Current User',
      createdOn: new Date().toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      data: data
    };
    
    const saved = saveAssessment(newAssessment);
    
    if (saved) {
      // Show appropriate message based on status
      if (data.status === 'Completed') {
        alert('✅ Residential assessment submitted successfully!');
      } else {
        alert('✅ Residential assessment saved as draft!');
      }
      setActiveForm(null);
      setSelectedDraft(null);
      loadAssessments();
    } else {
      alert('Failed to save assessment. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setActiveForm(null);
    setSelectedDraft(null);
    // Clear URL hash
    window.location.hash = '';
    // Session will be cleared by the useEffect above
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
      case 'draft':
        return 'status-in-progress';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="icon-sm" />;
      case 'in-progress':
      case 'draft':
        return <Clock className="icon-sm" />;
      default:
        return null;
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesType = filterType === 'all' || assessment.type === filterType;
    const matchesStatus = filterStatus === 'all' || assessment.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      assessment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssessments = filteredAssessments.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setSearchQuery('');
  };

  const hasActiveFilters = filterType !== 'all' || filterStatus !== 'all' || searchQuery !== '';

  // If a form is active, show only the form
  if (activeForm) {
    return (
      <div className="form-container">
        <div className="form-header">
          <button className="back-button" onClick={handleCloseForm}>
            <ArrowLeft className="icon-sm" />
            Back to Dashboard
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {activeForm === 'fare' && (
            <FAREQuestionnaire 
              onClose={handleCloseForm}
              onSave={handleFARESave}
              draftData={selectedDraft}
            />
          )}
          
          {activeForm === 'cans' && (
            <CANSForm 
              onClose={handleCloseForm}
              onSave={handleCANSSave}
              draftData={selectedDraft}
            />
          )}
          
          {activeForm === 'residential' && (
            <ResidentialForm 
              onClose={handleCloseForm}
              onSave={handleResidentialSave}
              draftData={selectedDraft}
            />
          )}
        </div>
      </div>
    );
  }

  // Otherwise show the dashboard
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content-center">
          <h1 className="header-title-center">
            ASSESSMENT ENGINE DASHBOARD
          </h1>
        </div>
      </div>

      <div className="main-content">
        <div>
          <div className="section-header">
            <FileText />
            <h2>List of Assessments</h2>
          </div>
          <div className="assessment-cards">
            <div className="assessment-card" onClick={() => setActiveForm('cans')}>
              <div className="assessment-card-icon cans">📋</div>
              <div className="assessment-card-content">
                <div className="assessment-card-title">
                  Child and Adolescent Needs and Strengths (CANS)
                </div>
              </div>
              <ExternalLink className="assessment-card-arrow" />
            </div>

            <div className="assessment-card" onClick={() => setActiveForm('fare')}>
              <div className="assessment-card-icon fare">📝</div>
              <div className="assessment-card-content">
                <div className="assessment-card-title">
                  Foster Care Rating At Exit Interview (F.A.R.E) 
                </div>
              </div>
              <ExternalLink className="assessment-card-arrow" />
            </div>

            <div className="assessment-card" onClick={() => setActiveForm('residential')}>
              <div className="assessment-card-icon residential">🏢</div>
              <div className="assessment-card-content">
                <div className="assessment-card-title">
                  Residential Contract Performance Monitoring
                </div>
              </div>
              <ExternalLink className="assessment-card-arrow" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <CheckCircle className="icon" />
              My Assessments
              <span className="results-count">{filteredAssessments.length} of {assessments.length} results</span>
            </h2>
            <button 
              onClick={() => {
                setShowEmpty(!showEmpty);
                if (!showEmpty) {
                  loadAssessments();
                }
              }}
              className="refresh-button"
            >
              <RefreshCw className="icon-sm" />
              Refresh
            </button>
          </div>

          <div className="filters-row">
            <div className="filter-search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                className="filter-search"
                placeholder="Search by ID, Case ID, or Type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="CANS">CANS</option>
              <option value="F.A.R.E">F.A.R.E</option>
              <option value="Residential">Residential</option>
            </select>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>

          <div className="table-container">
            <table className="assessment-table">
              <thead>
                <tr>
                  <th>Assessment ID</th>
                  <th>Case ID</th>
                  <th>Assessment Type</th>
                  <th>Status</th>
                  <th>Created On</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {!showEmpty && currentAssessments.length > 0 ? (
                  currentAssessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td>
                        <a 
                          href={`#assessment/${assessment.type.toLowerCase().replace('.', '').replace(' ', '')}/${assessment.id}`}
                          className="assessment-link"
                          onClick={(e) => {
                            // Only prevent default if not opening in new tab
                            if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                              e.preventDefault();
                            }
                            
                            // Save to both sessionStorage (same tab) and localStorage (new tab support)
                            sessionStorage.setItem('selectedDraft', JSON.stringify(assessment));
                            localStorage.setItem('currentAssessmentDraft', JSON.stringify(assessment));
                            
                            // If opening in same tab, set state directly
                            if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                              setSelectedDraft(assessment);
                              
                              if (assessment.type === 'CANS') {
                                sessionStorage.setItem('activeForm', 'cans');
                                setActiveForm('cans');
                              }
                              else if (assessment.type === 'F.A.R.E') {
                                sessionStorage.setItem('activeForm', 'fare');
                                setActiveForm('fare');
                              }
                              else if (assessment.type === 'Residential') {
                                sessionStorage.setItem('activeForm', 'residential');
                                setActiveForm('residential');
                              }
                            }
                          }}
                        >
                          {assessment.id}
                        </a>
                      </td>
                      <td>{assessment.caseId}</td>
                      <td>{assessment.type}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(assessment.status)}`}>
                          {getStatusIcon(assessment.status)}
                          {assessment.status}
                        </span>
                      </td>
                      <td>{assessment.createdOn}</td>
                      <td>{assessment.createdBy || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <div className="empty-state-content">
                          <div className="empty-state-icon">
                            <FileText />
                          </div>
                          <span className="empty-state-title">No Assessment Found</span>
                          <span className="empty-state-subtitle">
                            No assessments have been performed yet
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - only show if more than 10 items */}
          {filteredAssessments.length > itemsPerPage && (
            <div className="pagination-wrapper">
              <div className="pagination-info">
                {startIndex + 1} - {Math.min(endIndex, filteredAssessments.length)} of {filteredAssessments.length} (0 selected)
              </div>
              
              <div className="pagination-controls">
                <button
                  className="pagination-arrow"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  title="Previous page"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>

                <div className="pagination-page-display">
                  Page {currentPage}
                </div>

                <button
                  className="pagination-arrow"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  title="Next page"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}