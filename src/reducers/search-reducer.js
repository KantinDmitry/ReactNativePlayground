const initialState = {
    text: '',
    results: [],
};

function searchReducer(state = initialState, action) {
    switch (action.type) {
        case 'SUBMIT_SEARH':
            return { ...state, text: action.payload };
        case 'RESET_SEARCH':
            return { ...state, ...initialState };
        case 'SAVE_RESULTS':
            return { ...state, results: action.payload || [] };
        default:
            return state;
    }
}

export default searchReducer;
