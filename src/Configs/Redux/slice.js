import { createSlice } from "@reduxjs/toolkit";

// TODO Reset Redux on Logout
/* eslint-disable no-param-reassign */
export const slice = createSlice({
  name: "store",
  initialState: {
    zoomSettings: {
      isMirrored: false,
      isMuted: true,
      isStartedVideo: false,
      cameraId: "",
      inputId: "",
      outputId: "",
    },
  },

  reducers: {
    setZoomSettings: (state, action) => {
      state.zoomSettings = action.payload;
    },
  },
});

export const { setZoomSettings } = slice.actions;

export default slice.reducer;
