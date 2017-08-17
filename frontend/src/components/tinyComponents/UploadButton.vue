<template>
<div>
    <Upload 
        :headers="{
            'X-CSRFToken': getCookie()
        }"
        :name="chooseName"
        type="drag"
        :on-success="ONSUCCESS"
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
import { beforePost, getCookie } from '../../utils/utils'

export default {
    props: {
        UPLOADTYPE: String,
        ONSUCCESS: Function,
        IMGSRC: String
    },
    computed: {
        chooseName () {
            return this.UPLOADTYPE
        },
        onFormatError () {
            if (this.UPLOADTYPE === 'thumbnail' || this.UPLOADTYPE === 'avatar') {
                return this.imageTypeError
            } else if (this.UPLOADTYPE === 'slide') {
                return this.slideTypeError
            }
        },
        onExceededSize () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return this.thumbnailSizeError
            } else if (this.UPLOADTYPE === 'slide') {
                return this.slideSizeError
            } else if (this.UPLOADTYPE === 'avatar') {
                return this.avatarSizeError
            }
        },
        showList () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return false
            } else if (this.UPLOADTYPE === 'slide') {
                return true
            } else if (this.UPLOADTYPE === 'avatar') {
                return false
            }
        },
        chooseFormat () {
            if (this.UPLOADTYPE === 'thumbnail' || this.UPLOADTYPE === 'avatar') {
                return ['jpg', 'jpeg', 'png', 'gif', 'bmp']
            } else if (this.UPLOADTYPE === 'slide') {
                return ['ppt', 'pptx', 'key']
            }
        },
        chooseMaxSize () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return 300
            } else if (this.UPLOADTYPE === 'slide') {
                return 10 * 1024
            } else if (this.UPLOADTYPE === 'avatar') {
                return 200
            }
        },
        chooseAction () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return '/setthumbnail/'
            } else if (this.UPLOADTYPE === 'slide') {
                return '/uploadslide/'
            } else if (this.UPLOADTYPE === 'avatar') {
                return '/changeavatar/'
            }
        },
        chooseId () {
            if (this.UPLOADTYPE === 'thumbnail') {
                return 'show-thumbnail'
            } else if (this.UPLOADTYPE === 'slide') {
                return 'show-slide'
            } else if (this.UPLOADTYPE === 'avatar') {
                return 'show-avatar'
            }
        },
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
        imageTypeError (file, fileList) {
            this.$Message.error('Image must be jpg jpeg png gif bmp')
        },
        slideTypeError (file, fileList) {
            this.$Message.error('slide must be ppt pptx key')
        },
        thumbnailSizeError (file, fileList) {
            this.$Message.error('thumbnail must under 300K')
        },
        slideSizeError (file, fileList) {
            this.$Message.error('slide must under 10M')
        },
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