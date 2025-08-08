// PrintQr.js
import React, { useRef } from 'react';
import { Paper, Grid, Button, Stack, Box, Modal, Divider } from '@mui/material';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import PrintLabel from './PrintLabel';
import AnimatedButton from 'components/AnimatedButton';
import { IconPrinter } from '@tabler/icons-react';

const PrintQr = ({ open, data, handleCloseModal }) => {
  const ref = useRef();

  if (!open || !data) return null;

  return (
    <>
      {open && (
        <Modal open={open} onClose={() => handleCloseModal()}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Stack
                    component={Paper}
                    elevation={5}
                    spacing={2}
                    sx={{ p: 3, maxHeight: '600px' }}
                  >
                    <>
                      {/* Add a close button */}
                      <Grid container justifyContent="flex-end" spacing={1}>
                        <Grid item>
                          <ReactToPrint content={() => ref.current}>
                            <PrintContextConsumer>
                              {({ handlePrint }) => (
                                <AnimatedButton
                                  title="Print"
                                  buttonName="Print"
                                  startIcon={<IconPrinter />}
                                  handleChange={handlePrint}
                                  transitions={true}
                                />
                              )}
                            </PrintContextConsumer>
                          </ReactToPrint>
                        </Grid>
                        <Grid item>
                          <AnimatedButton
                            title="Close"
                            buttonName="Close"
                            // startIcon={<IconPrinter />}
                            handleChange={handleCloseModal}
                            transitions={true}
                            color="error"
                          />
                        </Grid>
                      </Grid>

                      <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                        <Grid container transitions={true}>
                          <PrintLabel ref={ref} printData={data} />
                        </Grid>
                      </div>
                    </>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PrintQr;
