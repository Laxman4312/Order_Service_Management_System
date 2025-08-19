// import React, { useState, useEffect } from 'react';
// import {
//   Box,  Tab, Tabs, Button, Card, CardContent, Typography,
//   Divider, TextField, Table, TableBody, TableCell,
//   TableContainer, TableHead, TableRow, Paper, IconButton,
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   CircularProgress, Alert
// } from '@mui/material';
// import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
// import { useOrderStatus } from 'hooks/api-custom-hook/useOrderStatus'; 
// import { useServiceStatus } from 'hooks/api-custom-hook/useServiceStatus';


// const Statuses = () => {
//   const [tabValue, setTabValue] = useState('service');
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingStatus, setEditingStatus] = useState(null);
//   const [formData, setFormData] = useState({ status_name: '', message_template: '' });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Hook for service statuses
//   const {
//     data: serviceStatuses,
//     isLoading: isServiceLoading,
//     isError: isServiceError,
//     fetchStatusServices,
//     createStatusService,
//     updateStatusService,
//     deleteStatusService
//   } = useServiceStatus();

//   // Hook for order statuses
//   const {
//     data: orderStatuses,
//     isLoading: isOrderLoading,
//     isError: isOrderError,
//     fetchStatusOrders,
//     createStatusOrder,
//     updateStatusOrder,
//     deleteStatusOrder
//   } = useOrderStatus();

//   const loading = tabValue === 'service' ? isServiceLoading : isOrderLoading;
//   const apiError = tabValue === 'service' ? isServiceError : isOrderError;
//   const currentStatuses = tabValue === 'service' ? serviceStatuses || [] : orderStatuses || [];

//   useEffect(() => {
//     if (tabValue === 'service') fetchStatusServices();
//     else fetchStatusOrders();
//   }, [tabValue, fetchStatusServices, fetchStatusOrders]);

//   useEffect(() => {
//     if (apiError) {
//       setError('Failed to fetch statuses');
//     }
//   }, [apiError]);

//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => {
//         setError('');
//         setSuccess('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success]);

//   const handleTabChange = (e, newVal) => {
//     setTabValue(newVal);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.status_name.trim()) {
//       setError('Status name is required');
//       return;
//     }
//     try {
//       if (editingStatus) {
//         tabValue === 'service'
//           ? await updateStatusService(editingStatus.id, formData)
//           : await updateStatusOrder(editingStatus.id, formData)
//         setSuccess('Status updated successfully');
//       } else {
//         tabValue === 'service'
//           ? await createStatusService(formData)
//           : await createStatusOrder(formData);
//         setSuccess('Status created successfully');
//       }
//       handleCloseDialog();
//     } catch (err) {
//       console.error(err);
//       setError('Submission failed');
//     }
//   };

//   const handleEdit = (status) => {
//     setEditingStatus(status);
//     setFormData({ status_name: status.status_name || '', message_template: status.message_template || '' });
//     setDialogOpen(true);
//   };

//   const handleDelete = async (status) => {
//     if (!window.confirm('Are you sure you want to delete this status?')) return;
//     try {
//       tabValue === 'service'
//         ? await deleteStatusService(status.id) // ✅ Correct
//         : await deleteStatusOrder(status.id );
//       setSuccess('Status deleted successfully');
//     } catch (err) {
//       console.error(err);
//       setError('Delete failed');
//     }
//   };

//   const handleAddNew = () => {
//     setEditingStatus(null);
//     setFormData({ status_name: '', message_template: '' });
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setEditingStatus(null);
//     setFormData({ status_name: '', message_template: '' });
//     setError('');
//   };

//   return (
//     <Box sx={{ width: '100%', pt: 4, px: 2 }}>
//       <Typography variant="h4" component="h1" gutterBottom> Status Management </Typography>
//       <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//         Manage service and order statuses with message templates
//       </Typography>

//       {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
//       {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

//       <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
//         <CardContent sx={{ pb: '16px !important' }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Tabs value={tabValue} onChange={handleTabChange} aria-label="Status Tabs"
//               sx={{
//                 '& .MuiTab-root': {
//                   minWidth: 120, fontWeight: 600, fontSize: '0.95rem', textTransform: 'none',
//                   '&.Mui-selected': { backgroundColor: 'primary.main', color: 'white', borderRadius: '8px' },
//                 },
//               }}>
//               <Tab label="🔧 Service Status" value="service" />
//               <Tab label="📦 Order Status" value="order" />
//             </Tabs>
//             <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew} sx={{ ml: 2 }}>
//               Add New Status
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>

//       <Card sx={{ boxShadow: 3 }}>
//         <CardContent>
//           <Typography variant="h6" component="h2" gutterBottom>
//             {tabValue === 'service' ? 'Service Statuses' : 'Order Statuses'}
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           {loading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <TableContainer component={Paper} variant="outlined">
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                     <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
//                     <TableCell sx={{ fontWeight: 'bold' }}>Status Name</TableCell>
//                     <TableCell sx={{ fontWeight: 'bold' }}>Message Template</TableCell>
//                     <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {currentStatuses.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
//                         <Typography variant="body1" color="text.secondary">
//                           No {tabValue} statuses found. Click "Add New Status" to create one.
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     currentStatuses.map((status) => (
//                       <TableRow key={status.id} hover>
//                         <TableCell>{status.id}</TableCell>
//                         <TableCell>
//                           <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                             {status.status_name}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Typography variant="body2" sx={{
//                             maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis',
//                             whiteSpace: 'nowrap'
//                           }}>
//                             {status.message_template || 'No template'}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <IconButton size="small" color="primary" onClick={() => handleEdit(status)} sx={{ mr: 1 }}>
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton size="small" color="error" onClick={() => handleDelete(status)}>
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </CardContent>
//       </Card>

//       <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>{editingStatus ? 'Edit Status' : 'Add New Status'}</DialogTitle>
//         <DialogContent>
//           <Box sx={{ pt: 2 }}>
//             <TextField fullWidth label="Status Name" name="status_name" value={formData.status_name}
//               onChange={handleInputChange} margin="normal" required variant="outlined" />
//             <TextField fullWidth label="Message Template" name="message_template"
//               value={formData.message_template} onChange={handleInputChange} margin="normal"
//               multiline rows={4} variant="outlined" placeholder="Enter message template (optional)" />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" disabled={!formData.status_name.trim()}>
//             {editingStatus ? 'Update' : 'Create'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Statuses;

import React, { useState, useEffect } from 'react';
import {
  Box, Tab, Tabs, Button, Card, CardContent, Typography,
  Divider, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useOrderStatus } from 'hooks/api-custom-hook/useOrderStatus'; 
import { useServiceStatus } from 'hooks/api-custom-hook/useServiceStatus';


const Statuses = () => {
  const [tabValue, setTabValue] = useState('service');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [formData, setFormData] = useState({ status_name: '', message_template: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Hook for service statuses
  const {
    data: serviceStatuses,
    isLoading: isServiceLoading,
    isError: isServiceError,
    fetchStatusServices,
    createStatusService,
    updateStatusService,
    deleteStatusService
  } = useServiceStatus();

  // Hook for order statuses
  const {
    data: orderStatuses,
    isLoading: isOrderLoading,
    isError: isOrderError,
    fetchStatusOrders,
    createStatusOrder,
    updateStatusOrder,
    deleteStatusOrder
  } = useOrderStatus();

  const loading = tabValue === 'service' ? isServiceLoading : isOrderLoading;
  const apiError = tabValue === 'service' ? isServiceError : isOrderError;
  const currentStatuses = tabValue === 'service' ? serviceStatuses || [] : orderStatuses || [];

  useEffect(() => {
    if (tabValue === 'service') fetchStatusServices();
    else fetchStatusOrders();
  }, [tabValue, fetchStatusServices, fetchStatusOrders]);

  useEffect(() => {
    if (apiError) {
      setError('Failed to fetch statuses');
    }
  }, [apiError]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleTabChange = (e, newVal) => {
    setTabValue(newVal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.status_name.trim()) {
      setError('Status name is required');
      return;
    }

    try {
      setIsSaving(true); 

      if (editingStatus) {
        tabValue === 'service'
          ? await updateStatusService(editingStatus.id, formData)
          : await updateStatusOrder(editingStatus.id, formData);

        setSuccess('Status updated successfully');
      } else {
        tabValue === 'service'
          ? await createStatusService(formData)
          : await createStatusOrder(formData);

        setSuccess('Status created successfully');
      }

    
      tabValue === 'service' ? await fetchStatusServices() : await fetchStatusOrders();

      handleCloseDialog();
    } catch (err) {
      console.error(err);
      setError('Submission failed');
    } finally {
      setIsSaving(false); 
    }
  };

  const handleEdit = (status) => {
    setEditingStatus(status);
    setFormData({
      status_name: status.status_name || '',
      message_template: status.message_template || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (status) => {
    if (!window.confirm('Are you sure you want to delete this status?')) return;

    try {
      setIsSaving(true); 

      tabValue === 'service'
        ? await deleteStatusService(status.id)
        : await deleteStatusOrder(status.id);

      setSuccess('Status deleted successfully');

    
      tabValue === 'service' ? await fetchStatusServices() : await fetchStatusOrders();
    } catch (err) {
      console.error(err);
      setError('Delete failed');
    } finally {
      setIsSaving(false); 
    }
  };

  const handleAddNew = () => {
    setEditingStatus(null);
    setFormData({ status_name: '', message_template: '' });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingStatus(null);
    setFormData({ status_name: '', message_template: '' });
    setError('');
    setIsSaving(false); 
  };

  return (
    <Box sx={{ width: '100%', pt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>Status Management</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage service and order statuses with message templates
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  minWidth: 120, fontWeight: 600, fontSize: '0.95rem', textTransform: 'none',
                  '&.Mui-selected': { backgroundColor: 'primary.main', color: 'white', borderRadius: '8px' },
                },
              }}
            >
              <Tab label="🔧 Service Status" value="service" />
              <Tab label="📦 Order Status" value="order" />
            </Tabs>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew} sx={{ ml: 2 }}>
              Add New Status
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {tabValue === 'service' ? 'Service Statuses' : 'Order Statuses'}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Message Template</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentStatuses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No {tabValue} statuses found. Click "Add New Status" to create one.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentStatuses.map((status) => (
                      <TableRow key={status.id} hover>
                        <TableCell>{status.id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {status.status_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{
                            maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {status.message_template || 'No template'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(status)}
                            sx={{ mr: 1 }}
                            disabled={isSaving}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(status)}
                            disabled={isSaving}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingStatus ? 'Edit Status' : 'Add New Status'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Status Name"
              name="status_name"
              value={formData.status_name}
              onChange={handleInputChange}
              margin="normal"
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Message Template"
              name="message_template"
              value={formData.message_template}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter message template (optional)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit" disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.status_name.trim() || isSaving}
          >
            {isSaving ? <CircularProgress size={20} color="inherit" /> : editingStatus ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Statuses;
