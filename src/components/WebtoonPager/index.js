/**
 * Created by fiddlest on 3/2/2017.
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, ToolbarAndroid, AsyncStorage } from 'react-native'
import { TabViewAnimated, TabBar } from 'react-native-tab-view'
import { bindActionCreators } from 'redux'
import {upateSite} from 'redux/actions'
import ToonGird from 'components/ToonGrid'
import { siteList, pagerRoutes, weekdaysEng } from 'models/data'
import { defaultModel } from 'models/model'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'



@connect((state) => ({
  webtoons: state.webtoon.webtoons[state.webtoon.site],
  site: state.webtoon.site
}),
(dispatch) => {
  return bindActionCreators({
      upateSite: upateSite
  }, dispatch)
})
class WebtoonPager extends Component {
  state = {
    index: 0,
    routes: pagerRoutes,
    toolbarActions: [],
    favoriteSelectActive: false,
    favoriteSelected: [],
  }

  constructor(props){
    super(props)
    console.log(this.props)
  }
  _onActionSelected = position => {
    const {site} = this.props
    const actionTitle = toolbarActions[position].title.toLowerCase()
    if (siteList.indexOf(actionTitle) > -1 && site !== actionTitle) {
      //Turn off favorite selection mode
      this.setState({
        favoriteSelectActive: false,
      })
      this.props.fetchWebtoonFromDb(actionTitle)
    }
    if (actionTitle === 'like') {
      const { webtoons } = this.props
      const favorites = webtoons
        .filter(w => w.site == site && w.favorite)
        .map(w => w.toon_id)
      if (this.state.favoriteSelectActive) {
        //need to update favorite state on local and server
      }
      this.setState({
        favoriteSelected: [this.state.favoriteSelecte, ...favorites],
        favoriteSelectActive: !this.state.favoriteSelectActive,
      })
    }
  }
 
  _handleChangeTab = index => {
    this.setState({
      index,
    })
  }
  _renderHeader = props => {
    return <TabBar {...props} />
  }
  _renderScene = (
    { favoriteSelectActive },
    { webtoons, width, isFetching }
  ) => {
    console.log(webtoons)
    return ({ index }) => {
      return (
        <ToonGird
          index={index}
          webtoons={webtoons.filter(
            webtoon => webtoon.weekday == weekdaysEng[index]
          )}
          width={width}
          favoriteSelectActive={favoriteSelectActive}
          isFetching={isFetching}
          handleCardClick={this.handleCardClick}
        />
      )
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {site} = this.props
    const { favoriteSelectActive } = this.state
    if (
      site !== nextProps.site ||
      favoriteSelectActive !== nextState.favoriteSelectActive
    ) {
      return true
    }
    return false
  }

  handleCardClick = (toonId) => {
    const { favoriteSelectActive } = this.state
    if (!favoriteSelectActive && toonId) {
   
    } else if (favoriteSelectActive && toonId) {
      const index = this.state.favoriteSelected.indexOf(toonId)
      let selectedIds = []
      if (index < 0) selectedIds = this.state.favoriteSelected.concat(toonId)
      else selectedIds = this.state.favoriteSelected.filter(id => id !== toonId)
      this.setState({
        favoriteSelected: selectedIds,
      })
    }
  }
  setActions = site => {
    const actions = toolbarActions.filter(action => {
      if (site !== action.title.toLowerCase()) return action
    })
    this.setState({
      toolbarActions: actions,
    })
  }
  render() {
    const {site, webtoons} = this.props
    console.log("pager", webtoons)
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <MaterialIcon.ToolbarAndroid
          title={site.toUpperCase()}
          style={{
            height: 56,
            backgroundColor: toolbarData[site.toLowerCase()].backgroundColor,
          }}
          onActionSelected={this._onActionSelected}
          titleColor="white"
          subtitleColor="white"
          actions={toolbarActions}
        />
        {
          webtoons.length > 0 &&
          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            renderScene={this._renderScene(this.state, this.props)}
            renderHeader={this._renderHeader}
            onRequestChangeTab={this._handleChangeTab}
          />
        }

      </View>
    )
  }
}
WebtoonPager.defaultProps = {
  site: 'naver',
}
export default WebtoonPager

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const toolbarActions = [
  { title: 'Naver' },
  { title: 'Daum' },
  {
    title: 'Like',
    show: 'always',
    iconName: 'favorite',
  },
]

const toolbarData = {
  naver: {
    site: 'Naver',
    backgroundColor: '#2DB400'
  },
  daum: {
    site: 'Daum',
    backgroundColor: '#E83D3D'
  },
  rezin: {
    site: 'Rezin',
    backgroundColor: '#E50020'
  },
  kakao: {
    site: 'Kakao',
    backgroundColor: '#F0CC18'
  }
}
