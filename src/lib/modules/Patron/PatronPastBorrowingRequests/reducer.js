import { IS_LOADING, SUCCESS, HAS_ERROR } from './actions';

export const initialState = {
  isLoading: true,
  hasError: false,
  data: { hits: [], total: 0 },
  error: {},
  sortBy: 'transaction_date',
  sortOrder: 'asc',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: {},
        hasError: false,
      };
    case HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasError: true,
      };
    default:
      return state;
  }
};
