import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useIntl } from "react-intl";
import { Box, Button, CircularProgress, MenuItem, Stack } from "@mui/material";
import { useTheme } from "@mui/system";
import {
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faChevronDown,
} from "@fortawesome/pro-duotone-svg-icons";

import { fontFamily } from "theme";
import Widget from "components/dashboard/Widget";
import { AppDispatch, RootState } from "store/store";
import { i18nLangSelector } from "store/i18n";
import { userActiveSchoolSelector, userActiveSeasonSelector } from "store/user";
import StyledMenu from "utils/StyledMenu";
import { TLang } from "utils/shared-types";
import {
  enrollmentStatsActions,
  enrollmentStatsSelector,
  enrollmentStatsPhaseSelector,
} from "pages/school/_store/enrollmentStats";

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state),
  enrollmentStats: enrollmentStatsSelector(state),
  enrollmentStatsPhase: enrollmentStatsPhaseSelector(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullEnrollmentStats: (lang: TLang, schoolId: number, period: string) =>
    dispatch(
      enrollmentStatsActions.pullEnrollmentStats(lang, schoolId, period)
    ),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TEnrollmentChartProps = PropsFromRedux;

const EnrollmentChart = (props: TEnrollmentChartProps) => {
  const {
    lang,
    activeSchool,
    activeSeason,
    enrollmentStats,
    enrollmentStatsPhase,
    pullEnrollmentStats,
  } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [chartData, setChartData] = React.useState<any>(null);
  const [dropdownKey, setDropdownKey] = React.useState<string>("month");
  const [dropdownTitle, setDropdownTitle] = React.useState<string>();
  const [chartMenuElt, setChartMenuElt] = React.useState<HTMLElement>(null);
  const intl = useIntl();
  const theme = useTheme();

  React.useEffect(() => {
    // Pull enrollment stats
    pullEnrollmentStats(lang, activeSchool.id, dropdownKey);

    // Set title of the dropdown menu
    setDropdownTitle(
      dropdownKey === "week"
        ? intl.formatMessage({ id: "calendar.week" })
        : dropdownKey === "month"
        ? intl.formatMessage({ id: "calendar.month" })
        : dropdownKey === "2months"
        ? intl.formatMessage({ id: "calendar.n-months" }, { n: 2 })
        : dropdownKey === "3months"
        ? intl.formatMessage({ id: "calendar.n-months" }, { n: 3 })
        : dropdownKey === "6months"
        ? intl.formatMessage({ id: "calendar.n-months" }, { n: 6 })
        : intl.formatMessage({ id: "calendar.year" })
    );
  }, [lang, activeSchool, activeSeason, dropdownKey]);

  React.useEffect(() => {
    setChartData(enrollmentStats || null);
  }, [enrollmentStats]);

  return (
    <Widget
      title={intl.formatMessage({ id: "dashboard.enrollment.stats" })}
      subheader={intl.formatMessage({
        id: "dashboard.enrollment.stats_description",
      })}
      action={
        <Stack direction="row" sx={{ margin: "3px 8px" }}>
          {enrollmentStatsPhase?.endsWith("ing") && (
            <CircularProgress sx={{ mx: 1 }} color="inherit" size={20} />
          )}
          <Box>
            <Button
              id="basic-stats-button"
              aria-controls="basic-stats-menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                "& svg": {
                  fontSize: "14px !important",
                },
                "&:hover": {
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                },
              }}
              size="small"
              variant="outlined"
              color="secondary"
              disableElevation
              onClick={(event: React.MouseEvent<HTMLElement>) =>
                setChartMenuElt(event.currentTarget)
              }
              endIcon={<FontAwesomeIcon icon={faChevronDown} />}
            >
              {dropdownTitle}
            </Button>
            <StyledMenu
              id="basic-stats-menu"
              keepMounted
              MenuListProps={{
                "aria-labelledby": "basic-stats-menu",
              }}
              anchorEl={chartMenuElt}
              open={Boolean(chartMenuElt)}
              onClose={() => setDropdownKey(null)}
            >
              <MenuItem
                onClick={() => {
                  setDropdownKey("week");
                  setChartMenuElt(null);
                }}
                disableRipple
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                {intl.formatMessage({ id: "calendar.week" })}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setDropdownKey("month");
                  setChartMenuElt(null);
                }}
                disableRipple
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                {intl.formatMessage({ id: "calendar.month" })}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setDropdownKey("2months");
                  setChartMenuElt(null);
                }}
                disableRipple
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                {intl.formatMessage({ id: "calendar.n-months" }, { n: 2 })}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setDropdownKey("3months");
                  setChartMenuElt(null);
                }}
                disableRipple
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                {intl.formatMessage({ id: "calendar.n-months" }, { n: 3 })}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setDropdownKey("6months");
                  setChartMenuElt(null);
                }}
                disableRipple
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                {intl.formatMessage({ id: "calendar.n-months" }, { n: 6 })}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setDropdownKey("year");
                  setChartMenuElt(null);
                }}
                disableRipple
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                {intl.formatMessage({ id: "calendar.year" })}
              </MenuItem>
            </StyledMenu>
          </Box>
        </Stack>
      }
    >
      <Box
        sx={{
          fontFamily: fontFamily,
          fontSize: "0.6rem",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {(chartData && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="preEnrollment"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="enrollment"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        )) || <CircularProgress size={20} />}
      </Box>
    </Widget>
  );
};

export default connector(EnrollmentChart);
