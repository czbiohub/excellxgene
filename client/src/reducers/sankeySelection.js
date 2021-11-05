const SankeySelection = (
  state={displaySankey: false, categories: {}, sankeyData: null, dataRefresher: false, refresher: false, numChecked: 0, cachedSankey: {}, currCacheKey: null, maxLink: 0},
  action
) => {
  switch (action.type) {
    case "sankey: toggle": {
      const { category } = action;
      const value = state?.categories?.[category] ?? false;
      state.categories[category] = !value;
      state.refresher = !state.refresher;
      const numCheckedNow = Object.values(state.categories).reduce((a, item) => a + item, 0);
      if (numCheckedNow >= 1) {
        state.displaySankey = true;
      } else {
        state.displaySankey = false;
      }
      state.numChecked = numCheckedNow
      return state;
    }
    case "sankey: set": {
      const { category, value } = action;
      state.categories[category] = value;
      state.refresher = !state.refresher;
      const numCheckedNow = Object.values(state.categories).reduce((a, item) => a + item, 0);
      if (numCheckedNow >= 1) {
        state.displaySankey = true;
      } else {
        state.displaySankey = false;
      }
      state.numChecked = numCheckedNow
      return state;
    }    
    case "sankey: set data": {
      const { data } = action;
      state.sankeyData = data;
      const vals = []
      for (const [_,val] of Object.entries(data.links)) {
        vals.push(val.value)
      }
      state.maxLink = parseFloat(Math.max(...vals).toFixed(2))
      state.dataRefresher = !state.dataRefresher
      return state;
    }
    case "sankey: rename category": {
      const { oldCategoryName, newCategoryName } = action;
      const { categories } = state;
      const newCategories = {};
      delete Object.assign(newCategories, categories, {[newCategoryName]: categories[oldCategoryName] })[oldCategoryName];      
      return {
        ...state,
        categories: newCategories
      };
    }
    case "sankey: cache results": {
      const { sankey, key } = action;
      const { cachedSankey } = state;
      return {
        ...state,
        cachedSankey: {...cachedSankey, [key]: sankey}
      }
    }
    case "sankey: set current cache key": {
      const { key } = action;
      return {
        ...state,
        currCacheKey: key
      }
    }
    case "sankey: clear cached result": {
      const { key } = action;
      const { cachedSankey } = state;   
      const { [key]: dummy, ...newObj} = cachedSankey;   
      return {
        ...state,
        cachedSankey: newObj
      }
    }    
    case "sankey: reset": {
      return state={dataRefresher: false, cachedSankey: state.cachedSankey, displaySankey: false, categories: {}, sankeyData: null, refresher: false, numChecked: 0, currCacheKey: null};
    }    
    default:
      return state;
  }
};

export const sankeyController = (
  state = {
    pendingFetch: null,
  },
  action
) => {
  switch (action.type) {
    case "sankey: request start": {
      return {
        ...state,
        pendingFetch: action.abortableFetch,
      };
    }
    case "sankey: request aborted":
    case "sankey: request cancel":
    case "sankey: request completed": {
      return {
        ...state,
        pendingFetch: null,
      };
    }
    default: {
      return state;
    }
  }
};

export default SankeySelection;
