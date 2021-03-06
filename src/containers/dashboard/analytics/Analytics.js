import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import { connect } from "react-redux";
import moment from "moment";

import { CardContainer, RowContainer } from "./containerStyles.js";
import { getAnalytics } from "../../../store/actions/analyticsAction.js";
import DatePicker from "../../../components/analytics/datepicker/DatePicker.js";
import { BrowserInfo } from "../../../components/analytics/graphs/PieChart";
import RevenueChart from "../../../components/analytics/graphs/AreaChart";
import Card from "../../../components/analytics/cards/Card.js";
import Table from "../../../components/analytics/tables/Table.js";
import MapChart from "../../../components/analytics/map/MapChart.js";
import TopTenOffers from "../../../components/analytics/graphs/TopTenOffers.js";
import RadarChart from "../../../components/analytics/graphs/RadarChart.js";
import DeviceChart from "../../../components/analytics/graphs/DeviceChart.js";

class Analytics extends Component {
  state = {
    started_at: "",
    ended_at: ""
  };

  componentDidMount() {
    this.props.getAnalytics(this.props.currentAnalyticId);
    this.analyticsInterval = setInterval(() => {
      this.props.getAnalytics(
        this.props.currentAnalyticId,
        this.getDateQueryString()
      );
    }, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.analyticsInterval);
  }

  getFilteredAnalytics = () => {
    this.props.getAnalytics(
      this.props.currentAnalyticId,
      this.getDateQueryString()
    );
  };

  getDateQueryString = () => {
    if (this.state.started_at && this.state.ended_at) {
      const started = `${moment(this.state.started_at).format(
        "YYYY-MM-DD"
      )}T00:00:00Z`;
      const ended = `${moment(this.state.ended_at).format(
        "YYYY-MM-DD"
      )}T23:59:00Z`;
      return `?started_at=${started}&ended_at=${ended}`;
    } else {
      return "";
    }
  };

  handleDateChange = (date, name) => {
    this.setState({ [name]: date });
  };

  getCTR = () => {
    const clicks = this.props.analytics.actionCount.clicks;
    const impressions = this.props.analytics.actionCount.impressions;

    const ctr = Math.round((clicks / impressions) * 100 * 100) / 100;

    return ctr || "0";
  };

  getCityData = () => {
    if (this.props.analytics.cities.length) {
      const range =
        this.props.analytics.actionCount.clicks +
        this.props.analytics.actionCount.impressions;
      return {
        cities: this.props.analytics.cities.map(city => {
          return {
            name: city.city,
            coordinates: [Number(city.longitude), Number(city.latitude)],
            population: city.num
          };
        }),
        cityScale: scaleLinear()
          .domain([0, range])
          .range([1, 25])
      };
    } else {
      return {
        cities: [],
        cityScale: {}
      };
    }
  };

  render() {
    const { analytics } = this.props;

    const { started_at, ended_at } = this.state;

    return (
      <>
        {analytics.length !== 0 && (
          <>
          {/* ------------------------------ Date Pickers ------------------------------ */}
            <DatePicker
              startedAt={started_at}
              endedAt={ended_at}
              getFilteredAnalytics={this.getFilteredAnalytics}
              handleDateChange={this.handleDateChange}
            />
            <CardContainer>
              {/* ------------------------------ Impressions card ------------------------------ */}
              <Card
                icon="fas fa-eye"
                dataType="Impressions"
                data={analytics.actionCount.impressions}
                actions={analytics.impressions}
                firstColor="#ffa726"
                secondColor="#fb8c00"
                growth={analytics.growth.impressions || 0}
              />
              {/* ------------------------------ Clicks Card ------------------------------ */}
              <Card
                icon="fas fa-mouse-pointer"
                dataType="Clicks"
                data={analytics.actionCount.clicks}
                actions={analytics.clicks}
                firstColor="#66bb6a"
                secondColor="#43a047"
                growth={analytics.growth.clicks || 0}
              />
              {/* ------------------------------ Click Through Rate Card ------------------------------ */}
              <Card
                icon="fas fa-percentage"
                dataType="Click Through Rate"
                data={
                  [...analytics.clicks, ...analytics.impressions].sort(
                    (first, second) =>
                      Date.parse(second.created_at) -
                      Date.parse(first.created_at)
                  ).length
                }
                ctr={this.getCTR()}
                actions={[...analytics.clicks, ...analytics.impressions].sort(
                  (first, second) =>
                    Date.parse(second.created_at) - Date.parse(first.created_at)
                )}
                firstColor="#ef5350"
                secondColor="#e53935"
              />
              {/* ------------------------------ Conversions Card ------------------------------ */}
              <Card
                icon="fas fa-exchange-alt"
                dataType="Conversions"
                data={analytics.actionCount.conversions}
                actions={analytics.conversions}
                firstColor="#26c6da"
                secondColor="#00acc1"
                growth={analytics.growth.conversions || 0}
              />
            </CardContainer>
            <RowContainer>
              {/* ------------------------------ Revenue Chart ------------------------------ */}
              <RevenueChart
                data={
                    analytics.payments
                    ? analytics.payments
                    : analytics.payouts
                    ? analytics.payouts
                    : []
                }
                growth={analytics.stripeGrowth}
              />
              {/* ------------------------------ Browser Chart ------------------------------ */}
              <div className="browser-chart">
                <BrowserInfo data={analytics.browserCount} />
              </div>
            </RowContainer>
            <RowContainer>
              <div className="main-tables-container">
                <div className="tables-container">
                  {/* ------------------------------ Impressions Table ------------------------------ */}
                  <Table
                    data={analytics.impressions}
                    dataType="Impressions"
                    growth={analytics.growth.impressions || 0}
                  />
                  {/* ------------------------------ Clicks Table ------------------------------ */}
                  <Table
                    data={analytics.clicks}
                    dataType="Clicks"
                    growth={analytics.growth.clicks || 0}
                  />
                </div>
                {/* ------------------------------ Map Chart ------------------------------ */}
                <MapChart data={this.getCityData()} />
              </div>
            </RowContainer>

            <RowContainer>
              <div className="top-offers-row">
                {/* ------------------------------ Top Ten Offers ------------------------------ */}
                <TopTenOffers data={analytics.offersRanking} />
                {/* ------------------------------ Category Rank Chart ------------------------------ */}
                <RadarChart data={analytics.categories} />
                {/* ------------------------------ Device rank chart ------------------------------ */}
                <DeviceChart data={analytics.devices} />
              </div>
            </RowContainer>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  analytics: state.analyticsReducer.analytics
});

export default connect(
  mapStateToProps,
  {
    getAnalytics
  }
)(Analytics);
