import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISubscriber, IUser } from "@/interfaces";

interface initialState {
  subscriberList: { subscriberList: ISubscriber }[];
  subscribedChannelList: { subscribedChannelList: IUser }[];
}

const initialState: initialState = {
  subscriberList: [],
  subscribedChannelList: [],
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriberList: (
      state,
      action: PayloadAction<{ subscriberList: ISubscriber }[]>
    ) => {
      state.subscriberList = action.payload;
    },
    setSubscribedChannelList: (
      state,
      action: PayloadAction<{ subscribedChannelList: IUser }[]>
    ) => {
      state.subscribedChannelList = action.payload;
    },
  },
});

export default subscriptionSlice.reducer;
export const { setSubscriberList, setSubscribedChannelList } =
  subscriptionSlice.actions;
