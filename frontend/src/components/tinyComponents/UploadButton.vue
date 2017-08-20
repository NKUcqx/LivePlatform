<template>
<div>
    <Upload 
        :headers="{
            'X-CSRFToken': getCookie()
        }"
        :name="chooseName"
        type="drag"
        :before-upload="ONBEFORE"
        :on-success="ONSUCCESS"
        :on-error="ONERROR"
        :on-format-error="onFormatError"
        :on-exceeded-size="onExceededSize"
        :show-upload-list="showList"
        :format="chooseFormat"
        :max-size="chooseMaxSize"
        :action="chooseAction">
        <div>
            <img :src="IMGSRC" :id="chooseId">
            <div class="upload-text">{{chooseMessage}}</div>
        </div>
    </Upload>
</div>
</template>

<script>
/**
 *Module TinyComponents
 *
 *@module TinyComponents
 *@requires Utils
 */
import { beforePost, getCookie } from '../../utils/utils'
import { CONST } from '../../utils/const'

/**
 *上传按钮
 *@class UploadButton
 *@constructor
 */
export default {
    props: {
        UPLOADTYPE: String,
        ONBEFORE: Function,
        ONSUCCESS: Function,
        ONERROR: {
            type: Function,
            default: () => {
                alert(CONST.failure('Upload file'))
            }
        },
        IMGSRC: {
            type: String,
            default: '../../../static/img/PPT.png'
        }
    },
    computed: {
        /**
         *选择上传按钮名称
         *@method chooseName
         *@return {String} 返回父组件传入的上传按钮名称
         */
        chooseName () {
            return this.UPLOADTYPE
        },
        /**
         *选择格式错误回调函数
         *@method onFormatError
         *@return {Function} 返回父组件指定类型上传按钮的格式错误回调函数
         */
        onFormatError () {
            if (this.UPLOADTYPE === 'thumbnail' || this.UPLOADTYPE === 'avatar') {
                return this.imageTypeError
            } else if (this.UPLOADTYPE === 'slide') {
                return this.slideTypeError
            }
        },
        /**
         *选择文件大小错误回调函数
         *@method onExceededSize
         *@return {Function} 返回父组件指定类型上传按钮的文件大小错误回调函数
         */
        onExceededSize () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return this.thumbnailSizeError
            } else if (this.UPLOADTYPE === 'slide') {
                return this.slideSizeError
            } else if (this.UPLOADTYPE === 'avatar') {
                return this.avatarSizeError
            }
        },
        /**
         *选择是否显示上传文件列表
         *@method showList
         *@return {Boolean} 返回父组件指定类型上传按钮是否显示上传列表
         */
        showList () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return false
            } else if (this.UPLOADTYPE === 'slide') {
                return true
            } else if (this.UPLOADTYPE === 'avatar') {
                return false
            }
        },
        /**
         *选择上传文件类型
         *@method chooseFormat
         *@return {Object} 返回父组件指定类型上传按钮的上传文件类型（字符串数组）
         */
        chooseFormat () {
            if (this.UPLOADTYPE === 'thumbnail' || this.UPLOADTYPE === 'avatar') {
                return ['jpg', 'jpeg', 'png', 'gif', 'bmp']
            } else if (this.UPLOADTYPE === 'slide') {
                return ['ppt', 'pptx', 'key']
            }
        },
        /**
         *选择上传文件大小限制
         *@method chooseMaxSize
         *@return {Number} 返回父组件指定类型上传按钮的上传文件大小限制
         */
        chooseMaxSize () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return 300
            } else if (this.UPLOADTYPE === 'slide') {
                return 5 * 1024
            } else if (this.UPLOADTYPE === 'avatar') {
                return 200
            }
        },
        /**
         *选择上传文件地址
         *@method chooseAction
         *@return {String} 返回父组件指定类型上传按钮的上传文件地址
         */
        chooseAction () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return '/setthumbnail/'
            } else if (this.UPLOADTYPE === 'slide') {
                return '/uploadslide/'
            } else if (this.UPLOADTYPE === 'avatar') {
                return '/changeavatar/'
            }
        },
        /**
         *选择图标id
         *@method chooseId
         *@return {String} 返回父组件指定类型上传按钮的图标id
         */
        chooseId () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return 'show-thumbnail'
            } else if (this.UPLOADTYPE === 'slide') {
                return 'show-slide'
            } else if (this.UPLOADTYPE === 'avatar') {
                return 'show-avatar'
            }
        },
        /**
         *选择提示信息
         *@method chooseMessage
         *@return {String} 返回父组件指定类型上传按钮的提示信息
         */
        chooseMessage () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return 'click image or drag to update your thumbnail of live'
            } else if (this.UPLOADTYPE === 'slide') {
                return 'click image or drag to upload your slide'
            } else if (this.UPLOADTYPE === 'avatar') {
                return 'click image or drag to update your avatar'
            }
        }
    },
    methods: {
        getCookie () {
            return getCookie('csrftoken')
        },
        /**
         *上传图片类型错误回调函数
         *@event imageTypeError
         */
        imageTypeError (file, fileList) {
            this.$Message.error('Image must be jpg jpeg png gif bmp')
        },
        /**
         *上传PPT类型错误回调函数
         *@event slideTypeError
         */
        slideTypeError (file, fileList) {
            this.$Message.error('slide must be ppt pptx key')
        },
        /**
         *上传房间缩略图超过大小限制回调函数
         *@event thumbnailSizeError
         */
        thumbnailSizeError (file, fileList) {
            this.$Message.error('thumbnail must under 300K')
        },
        /**
         *上传PPT超过大小限制回调函数
         *@event slideSizeError
         */
        slideSizeError (file, fileList) {
            this.$Message.error('slide must under 5M')
        },
        /**
         *上传头像超过大小限制回调函数
         *@event avatarSizeError
         */
        avatarSizeError (file, fileList) {
            this.$Message.error('Image size must be under 200K')
        }
    }
}
</script>

<style scoped>
    #show-thumbnail {
        width: 150px;
        height: 90px;
        padding-top: 10px;
    }

    #show-slide {
        width: 64px;
        height: 64px;
        padding-top: 10px;
    }

    #show-avatar {
        display: inline-block;
        margin-top: 10px; 
        height: 90px;
        width: 90px;
        border-radius: 50%;
        border: 2px solid rgba(180,230,180,0.7);
    }

    .upload-text {
        font-size: 15px;
        margin-top: 10px;
        color: #5cadff;
    }
</style>