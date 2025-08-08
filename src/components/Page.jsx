import PropTypes from 'prop-types';
import React, { useLayoutEffect, useMemo } from 'react';
import ErrorBox from './ErrorComponent';
import { Box, Divider, Grid, Tab, useMediaQuery, useTheme } from '@mui/material';
import AnimatedButton from './AnimatedButton';
import PageLayout from './PageLayout';
import { useDispatch, useSelector } from 'react-redux';
import { TabContext, TabList } from '@mui/lab';
import EnhancedTable from './custom-table/EnhancedTable';
import { clearQUery, triggerTransitionsFlag } from 'store/slices/general';
import PageContainer from './container/PageContainer';
const PageButtons = React.memo(({ buttons, isMobile }) => (
  <Box
    display="flex"
    justifyContent="right"
    gap={1}
    sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}
  >
    {buttons.map((button, i) => (
      <Box key={i}>
        <AnimatedButton
          {...button}
          buttonName={button.buttonName}
          size={isMobile ? 'small' : button.size}
          transitions={true}
        />
      </Box>
    ))}
  </Box>
));

const PageTabs = React.memo(({ pageTabs, isMobile }) => (
  <TabContext value={pageTabs.tabValue}>
    <Box display="flex" justifyContent="center" flexWrap="wrap" sx={{ width: '100%' }}>
      <TabList
        onChange={pageTabs.handleTabChange}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile}
        allowScrollButtonsMobile
      >
        {pageTabs.tabList.map((item) => (
          <Tab key={item.value} label={item.label} value={item.value} />
        ))}
      </TabList>
    </Box>
  </TabContext>
));

const TableSection = React.memo(({ page }) => {
  return (
    <EnhancedTable
      title={page.title}
      query={page.tableData.query}
      headings={page.tableData.headings}
      tableData={page.tableData.data}
      handleTextChange={page.tableData.handleTextChange}
      loading={page.isLoading}
      paginationProps={page.tableData.paginationProps}
      hideFilterToggleButton={page.tableData?.hideFilterToggleButton}
      hideMasterSearch={page.tableData?.hideMasterSearch}
      handleTableDownload={page.tableData?.handleTableDownload}
      tableDownloadTooltipName={page.tableData?.tableDownloadTooltipName}
    />
  );
});

const PageView = ({ page }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { transitions } = useSelector((state) => state.auth);

  useLayoutEffect(() => {
    dispatch(clearQUery());
    if (!transitions) {
      dispatch(triggerTransitionsFlag());
    }
    return () => {
      dispatch(triggerTransitionsFlag());
    };
  }, [dispatch, transitions]);

  const errorMessage = useMemo(() => {
    if (!page.isError) return null;
    return (
      page.isError?.data?.message ||
      page?.isError?.message ||
      page?.isError ||
      'Internal Server Error'
    );
  }, [page.isError]);

  return (
    <PageContainer title={page?.title} description={`${page?.title} Page`}>
      <PageLayout
        pageIcon={page?.pageFavicon}
        pageTitle={page?.title}
        bgColor={page?.bgColor || 'rgba(1,119,224, 0.20)'}
      >
        <Grid container alignItems="center" justifyContent="center" rowSpacing={2}>
          <Grid item xs={12}>
            {page?.pageButtons && <PageButtons buttons={page.pageButtons} isMobile={isMobile} />}
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {page.pageTabs && (
            <Grid item xs={12}>
              <PageTabs pageTabs={page.pageTabs} isMobile={isMobile} />
            </Grid>
          )}

          <Grid item xs={12}>
            {page.isError ? <ErrorBox message={errorMessage} /> : <TableSection page={page} />}
          </Grid>
        </Grid>
      </PageLayout>
    </PageContainer>
  );
};

PageView.propTypes = {
  page: PropTypes.shape({
    title: PropTypes.string,
    pageFavicon: PropTypes.node,
    bgColor: PropTypes.string,
    pageButtons: PropTypes.arrayOf(PropTypes.object),
    pageTabs: PropTypes.shape({
      tabValue: PropTypes.string,
      handleTabChange: PropTypes.func,
      tabList: PropTypes.arrayOf(PropTypes.object),
    }),
    isError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    isLoading: PropTypes.bool,
    tableData: PropTypes.object,
  }).isRequired,
};

PageButtons.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

PageTabs.propTypes = {
  pageTabs: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

TableSection.propTypes = {
  page: PropTypes.object.isRequired,
};

export default React.memo(PageView);
