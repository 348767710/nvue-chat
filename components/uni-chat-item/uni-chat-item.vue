<template>
	<!-- #ifdef APP-NVUE -->
	<cell> 
		<!-- #endif -->
		<view :class="disabled ? 'uni-list-item--disabled' : ''" :hover-class="disabled || showSwitch ? '' : 'uni-list-item--hover'"
		 class="uni-list-item" @click="onClick">
		 
		 <view class="line" v-if="!isFirstChild && border" :style="{'width':borderWidth+'rpx'}">
		
		 </view>
			<view class="uni-list-item__container" :style="containerStyle" :class="{'uni-list-item--first':isFirstChild}">
				<view v-if="thumb" class="uni-list-item__icon">
					<image :src="thumb" class="uni-list-item__icon-img" :style="thumbStyle" />
				</view>
				<view v-else-if="showExtraIcon" class="uni-list-item__icon">
					<uni-icons :color="extraIcon.color" :size="extraIcon.size" :type="extraIcon.type" class="uni-icon-wrapper" />
				</view>
				<view class="uni-list-item__content" :style="desc ? 'flex-direction: row;align-items: center;' : ''">
					<slot />
					<text class="uni-list-item__content-title" :style="textStyle">{{ title }}</text>
					<text v-if="desc" :style="descStyle" style="word-break: break-word; width: 65%;">{{desc}}</text>
					<text v-if="note" class="uni-list-item__content-note">{{ note }}</text>
				</view>
				<view class="uni-list-item__extra">
					<text v-if="rightText" class="uni-list-item__extra-text" :style="rightTextStyle">{{rightText}}</text>
					<uni-badge v-if="showBadge" :type="badgeType" :text="badgeText" />
					<switch color="#29c160" v-if="showSwitch" :disabled="disabled" :checked="switchChecked" @change="onSwitchChange" />
					<slot name="right"></slot>
					<uni-icons v-if="showArrow" :size="40" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
				</view>
			</view>
		</view>
		<!-- #ifdef APP-NVUE -->
	</cell>
	<!-- #endif -->
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	import uniBadge from '../uni-badge/uni-badge.vue'
 
	export default {
		name: 'UniChatItem',
		components: {
			uniIcons,
			uniBadge
		},
		props: {
			title: {
				type: String,
				default: ''
			}, // ????????????
			note: {
				type: String,
				default: ''
			}, // ????????????
			disabled: {
				// ????????????
				type: [Boolean, String],
				default: false
			},
			showArrow: {
				// ??????????????????
				type: [Boolean, String],
				default: true
			},
			showBadge: {
				// ????????????????????????
				type: [Boolean, String, Number],
				default: false
			},
			showSwitch: {
				// ????????????Switch
				type: [Boolean, String],
				default: false
			},
			switchChecked: {
				// Switch???????????????
				type: [Boolean, String],
				default: false
			},
			badgeText: {
				// badge??????
				type: [String,Number],
				default: ''
			},
			badgeType: {
				// badge??????
				type: String,
				default: 'success'
			},
			rightText: {
				// ??????????????????
				type: String,
				default: ''
			},
			rightTextStyle:{
				type: String,
				default: ''
			},
			textStyle: {
				// ????????????
				type: String,
				default: ''
			},
			containerStyle: {
				// ??????
				type: String,
				default: ''
			},
			desc: {
				
				type: String,
				default: ''
			},
			descStyle: {
				// ??????
				type: String,
				default: ''
			},
			thumb: {
				// ?????????
				type: String,
				default: ''
			},
			thumbStyle:{
				type: String,
				default: ''
			},
			showExtraIcon: {
				// ????????????????????????
				type: [Boolean, String],
				default: false
			},
			
			border: {
				// ????????????????????????
				type: [Boolean],
				default: true
			},
			borderWidth: {
				// ????????????????????????
				type: [String],
				default: "650"
			},
			extraIcon: {
				type: Object,
				default () {
					return {
						type: 'contact',
						color: '#000000',
						size: 40
					}
				}
			}
		},
	 
		data() {
			return {
				isFirstChild: false
			}
		},
		mounted() {
			 
			 
		},
		methods: {
			onClick() {
				this.$emit('click')
			},
			onSwitchChange(e) {
				this.$emit('switchChange', e.detail)
			}
		}
	}
</script>

<style lang="scss" scoped>
	$list-item-pd: $uni-spacing-col-lg $uni-spacing-row-lg;

	.uni-list-item {
		font-size: $uni-font-size-lg;
		position: relative;
		flex-direction: column;
		justify-content: space-between;
		padding-left: $uni-spacing-row-lg;
	}

	.uni-list-item--disabled {
		// opacity: 0.3;
	}

	.uni-list-item--hover {
		background-color: $uni-bg-color-hover;
	}

	.uni-list-item__container {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		padding: $list-item-pd;
		padding-left: 0;
		flex: 1;
		position: relative;
		justify-content: space-between;
		align-items: center;
		/* #ifdef APP-PLUS */
		// border-top-color: #e3e2e6;
		// border-top-style: solid;
		// border-top-width: 0.05px;
		/* #endif */
	} 

	// .uni-list-item--first {
	// 	border-top-width: 0px;
	// }

	/* #ifndef APP-NVUE */
	// .uni-list-item__container:after {
	// 	position: absolute;
	// 	top: 0;
	// 	right: 0;
	// 	width: 85%;
	// 	height: 1px;
	// 	content: '';
	// 	-webkit-transform: scaleY(.3);
	// 	transform: scaleY(.3);
	// 	background-color: #e3e2e6;
	// } 

	// .uni-list-item--first:after {
	// 	height: 0px;
	// }

	/* #endif */





	.uni-list-item__content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		overflow: hidden;
		flex-direction: column;
		color: #3b4144;

	}

	.uni-list-item__content-title {
		font-size: 34rpx;
		font-weight: 500;
		color: #3b4144;
		overflow: hidden;
	}

	.uni-list-item__content-note {
		margin-top: 12rpx;
		color: $uni-text-color-grey;
		font-size: 26rpx;
		overflow: hidden;
	}

	.uni-list-item__extra {
		// width: 25%;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.uni-list-item__icon {
		margin-right: 18rpx;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.uni-list-item__icon-img {
		height: $uni-img-size-base;
		width: $uni-img-size-base;
	}

	.uni-list-item__extra-text {
		color: $uni-text-color-grey;
		font-size: $uni-font-size-sm;
	}
	.line {
		/* #ifndef APP-NVUE */
		align-self: flex-end;
		/* #endif */
		/* #ifndef APP-NVUE */
		position: absolute;
		right: 0;
		/* #endif */
		width: 650rpx;
		height: 1px;
		background-color: #f8f8f8;
	}
</style>
