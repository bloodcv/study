import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class ComMixins extends Vue {
  mixinsName = 'NamefromMixins';
  enterTime = 0;

  mounted() {
    console.log(`mixins - mounted - ${ this.mixinsName }`);
    this.enterTime = Date.now();
  }

  beforeDestroy() {
    console.log(`mixins - beforeDestroy - readTimeCount - ${ Date.now() - this.enterTime }`)
  }
}