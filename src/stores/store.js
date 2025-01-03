import { create } from "zustand";

export const useStore = create((set)=>({
    // state to check user login status
    userAuthenticated: false,
    setUserLoggedIn: (value)=>set({userAuthenticated: value}),

    // store the user data
    userData:{},
    setUserData:(data)=>set({userData:data}),

    // check the user is group admin or not
    isGrupAdmin:false,
    setIsGroupAdmin:(value)=>set({isGrupAdmin:value}),

    // store the group data
    announcementGroup:{},
    setAnnouncementGroup:(data)=>set({announcementGroup:data}),

    // select the category of group
    selectedCategory:"",
    setSelectedCategory:(value)=>set({selectedCategory:value}),

    // search query
    searchQuery:"",
    setSearchQuery:(value)=>set({searchQuery:value}),
    
    // user role
    role:"",
    setRole:(value)=>set({role:value}),
    
    // group admin data
    groupAdmin:{},
    setGroupAdmin:(data)=>set({groupAdmin:data}),

    // group joined status
    Joined:false,
    setJoined:(data)=>set({Joined:data}),

    // toggle the create group form 
    toggleCreateGroup:false,
    setToggleCreateGroup:(value)=>set({toggleCreateGroup:value}),

    // rating toggle
    toggleRating:false,
    setToggleRating:(value)=>set({toggleRating:value}),

    // Create new announcement toggle
    toggleCreateAnnouncement:false,
    setToggleCreateAnnouncement:(value)=>set({toggleCreateAnnouncement:value}),

    // comment posted
    commentFetch:false,
    setCommentFetch:(value)=>set({commentFetch:value}),

    // edit coment mode
    editCommentMode:false,
    setEditCommentMode:(value)=>set({editCommentMode:value}),

    // comment id
    commentId:"",
    setCommentId:(value)=>set({commentId:value}),


    // View all comments reply
    replyMode:false,
    setReplyMode:(value)=>set({replyMode:value}),

   
    // user email
    email:"",
    setEmail:(value)=>set({email:value}),



    // notification count
    notificationCount : 0,
    setNotificationCount:(value)=>set({notificationCount:value}),

    
    trigger : false,
    setTrigger:(value)=>set({trigger:value}),

}))