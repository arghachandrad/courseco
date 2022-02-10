import { combineReducers } from "redux"
import { counterReducer } from "./counter/reducer"
import kanyeReducer from "./kanye/reducer"

export const rootReducer = combineReducers({
  // This is where we add reducers.
  // Since we don't have any yet, leave this empty
  counter: counterReducer,
  kenye: kanyeReducer,
})
