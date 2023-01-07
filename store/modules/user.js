import WebSocket from '@/common/common.js';
import Utils from '@/common/utils.js';
import $store from '@/store/index.js';
export default {
	state: {
		url:'ws://imapi.gouguanli.com/index/ws',
		user: false,
		systemInfo:[],
		webSocket: null,
		utils: null,
		sessionList: [],
		friendApply: [],
		friendList: [],
		friendIds:[],
		friendListLetterSort: [],
		groupList:[],
		tabBarBadge:0,
		user_token : ''
	},
	mutations: {
		updateUser(state, {
			k,
			v
		}) {
			if (state.user) {
				state.user[k] = v
				uni.setStorageSync('user', state.user)
			}
		}
	},
	actions: {
		// 登录后处理
		login({
			state,
			dispatch
		}, res) {
			// 存到状态中
			state.user = res
			state.user_token = uni.getStorageSync('token');
			// 存储到本地存储中
			uni.setStorageSync('user', res)
			uni.setStorageSync('uid', res.id)
			// 连接socket
			state.webSocket = new WebSocket({
				url: uni.getStorageSync('WS') + '/index/ws?id=' + res.id + '&token=' + res.token
			})
			state.utils = new Utils()
			// 获取会话列表
			dispatch('getSessionList')
			// // 获取好友申请列表
			dispatch('getFriendApply')
			// // 获取好友列表
			dispatch('getFriendIds') 
			// // 获取群组列表
			dispatch('getGroupIds')
			// // 初始化总未读数角标
			dispatch('updateBadge')
		},
		updateUser({
			state,
			dispatch
		}, res) {
			// 存到状态中
			state.user = res
			// 存储到本地存储中
			uni.setStorageSync('user', res)
			uni.setStorageSync('uid', res.id)
		},
		getUserInfo({
			state,
			dispatch
		}) {
			// 存到状态中
			var that = this;
			uni.$u.http
			.post(
				'/user/getUser',
				{userid: state.user.id},
				{
					custom: { auth: true }
				}
			).then((res) => {
				dispatch('updateUser',res.data)
			}).catch((err) => {
				 
			}); 
		},
		logout({
			state,
			dispatch
		}) {
			 
			dispatch('closeWebSocket')
			state.webSocket.logout()
			state.user = false
			state.webSocket = null
			state.sessionList = false
			state.friendApply = false
			state.friendList = false
			state.tabBarBadge = 0
			state.friendList = false
			state.user_token = ""
			// 清除本地存储数据
			uni.removeStorageSync('token');
			uni.removeStorageSync('user');
			uni.removeStorageSync('uid');
			uni.removeStorageSync('friendIds')
			uni.removeStorageSync('groupList')
			uni.removeStorageSync('friendList')
			// 跳转到登录页
			uni.reLaunch({
				url: "/pages/index/login"
			})
		},
		initLogin({
			state,
			dispatch
		}) {
			// 拿到存储
			let user = uni.getStorageSync('user')
			if (user) {
				// 初始化登录状态
				state.user = user
				state.user_token = uni.getStorageSync('token');
				state.friendList = uni.getStorageSync('friendList') ? uni.getStorageSync('friendList') : [];
				state.groupList = uni.getStorageSync('groupList') ? uni.getStorageSync('groupList') : [];
				state.friendIds = uni.getStorageSync('friendIds') ? uni.getStorageSync('friendIds') : [];
				//state.friendIds = uni.setStorageSync('friendIds') ? uni.getStorageSync('friendIds') : [];
				// 连接socket
				state.webSocket = new WebSocket({
					url: uni.getStorageSync('WS') + '/index/ws?id=' + user.id + '&token=' + user.token
				})
				state.utils = new Utils()
				// 获取会话列表
				// dispatch('getSessionList')
				// // 获取好友申请列表
				// dispatch('getFriendApply')
				// // 获取好友列表
				// dispatch('getFriendIds')
				// // 获取群组列表
				// dispatch('getGroupIds')
				// // 初始化总未读数角标
				// dispatch('updateBadge')
				state.webSocket.checkToken();
			}  
		},
		
		closeWebSocket({state}){
			console.log(state.user,9999)
			if(state.webSocket){
				state.webSocket.close(state.user.id);
			}
		},
		
		// 获取会话列表
		getSessionList({
			state
		}) {
			state.sessionList = state.webSocket.getChatList()
			// 监听会话列表变化
			uni.$on('onUpdateSessionList', (list) => {
				state.sessionList = list
			})
		},
 
		// 获取申请列表
		getFriendApply({
			state
		}) {
			state.friendApply = state.webSocket.getFriendApply()
			uni.$on('onUpdateFriendApply', (list) => {
				state.friendApply = list
			})
		},

		//获取好友列表
		getFriendIds({
			state,
			dispatch
		}) { 
			//uni.showLoading();
			uni.$u.http
			.post(
				'/contact/loadfriend',
				{userid: state.user.id},
				{
					custom: { auth: true }
				}
			).then((res) => {
				console.log(res)
				dispatch('getFriendListByIds',res)
			}).catch((err) => {
				console.log(err);
			})
		},
		getFriendListByIds({
			state,
			dispatch
			
		}, res) {
			if(state.webSocket.checkResultData(res)){
				state.friendIds = res.rows;
				let friendIds = [];
				uni.setStorageSync('friendIds', res.rows)
				res.rows.forEach((item) => {
					friendIds.push(item.friend_id);
				})
				if(!friendIds){return;}
				var s = friendIds.toString()
				uni.$u.http
				.post(
					'/user/getUserByIds',
					{ids: s},
					{
						custom: { auth: true }
					}
				).then((res) => {
					if(res.rows){
						state.friendList = res.rows;
						uni.setStorageSync('friendList', res.rows)
						uni.hideLoading();
						state.friendListLetterSort = state.utils.sortFriendList(res.rows)
					}
				}).catch((err) => {
					console.log(err);
					uni.hideLoading();
				})
			}else{
				if(res.rows.length == 0){
					state.friendList = [];
					uni.setStorageSync('friendList', [])
					state.friendListLetterSort = [];
				}
				// console.log(res)
				// uni.showModal({
				//     title: '提示',
				//     content: res.result.msg,
				//     success: function () {
				// 		if(res.result.code == 30201){
				// 			dispatch('logout')
				// 		}
				//     }
				// });
				uni.hideLoading();
			}
		},
		
		getGroupIds({
			state,
			dispatch
		}) {
			// 监听会话列表变化
			uni.$on('onUpdateGroupList', (list) => {
				state.groupList = list
			})
			uni.$u.http
			.post(
				'/contact/getGroupInfo',
				{userid: state.user.id},
				{
					custom: { auth: true }
				}
			).then((res) => {
				 if(res.rows){
				
					uni.setStorageSync('groupList', res.rows)
				 	state.groupList = res.rows
				 }
			}).catch((err) => { 
				console.log(err);
			})
		},
		
		// 初始化总未读数角标
		updateBadge({state}){
			// 开启监听总未读数变化
			uni.$on('tabBarBadge',(num)=>{
				state.tabBarBadge = num
			})
			state.webSocket.updateBadge()
		}
	}
}
