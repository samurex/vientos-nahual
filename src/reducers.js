import { combineReducers } from 'redux'
import * as ActionTypes from './actionTypes'
const config = require('../config.json')

function projects (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_PROJECTS_SUCCEEDED:
      // normalize
      return action.projects.map(project => {
        if (!project.needs) project.needs = []
        if (!project.offers) project.offers = []
        if (!project.locations) {
          project.locations = []
        } else {
          project.locations = project.locations.map(location => {
            return {
              latitude: Number(location.latitude),
              longitude: Number(location.longitude)
            }
          })
        }
        return project
      })
    default:
      return state
  }
}

function intents (state = [], action) {
  switch (action.type) {
    case ActionTypes.CREATE_INTENT_SUCCEEDED:
      return [
        ...state,
        action.intent
      ]
    default:
      return state
  }
}

function categories (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_CATEGORIES_SUCCEEDED:
      return action.categories.map(category => Object.assign(category, { selected: false }))
    case ActionTypes.TOGGLE_CATEGORY:
      let index = state.findIndex(e => e.id === action.id)
      let updated = Object.create(state[index])
      updated.selected = !updated.selected
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1)
      ]
    case ActionTypes.CLEAR_CATEGORIES_FILTER:
      return state.map(category => Object.assign(category, { selected: false }))
    default:
      return state
  }
}

function collaborationTypes (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_COLLABORATION_TYPES_SUCCEEDED:
      return action.collaborationTypes.map(collaborationType => Object.assign(collaborationType, { selected: false }))
    case ActionTypes.TOGGLE_COLLABORATION_TYPE:
      let index = state.findIndex(e => e.id === action.id)
      let updated = Object.create(state[index])
      updated.selected = !updated.selected
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1)
      ]
    case ActionTypes.CLEAR_COLLABORATION_TYPES_FILTER:
      return state.collaborationTypes.map(collaborationType => Object.assign(collaborationType, { selected: false }))
    default:
      return state
  }
}

function person (state = null, action) {
  switch (action.type) {
    case ActionTypes.HELLO_SUCCEEDED:
      if (action.person && !action.person.follows) action.person.follows = []
      return action.person
    case ActionTypes.BYE_SUCCEEDED:
      return null
    case ActionTypes.FOLLOW_SUCCEEDED:
      let updated = state.follows.slice()
      updated.push(action.projectId)
      return Object.assign({}, state, { follows: updated })
    case ActionTypes.UNFOLLOW_SUCCEEDED:
      let index = state.follows.indexOf(action.projectId)
      return Object.assign({}, state, { follows: [
        ...state.follows.slice(0, index),
        ...state.follows.slice(index + 1)
      ]})
    default:
      return state
  }
}

function language (state = config.language, action) {
  switch (action.type) {
    case ActionTypes.SET_LANGUAGE:
      return action.language
    default:
      return state
  }
}

function labels (state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_LABELS_SUCCEEDED:
      return action.labels
    default:
      return state
  }
}

function boundingBox (state = config.map.boundingBox, action) {
  switch (action.type) {
    case ActionTypes.SET_BOUNDING_BOX:
      return action.boundingBox
    default:
      return state
  }
}
export default combineReducers({
  projects,
  categories,
  collaborationTypes,
  person,
  boundingBox,
  language,
  labels,
  intents
})
