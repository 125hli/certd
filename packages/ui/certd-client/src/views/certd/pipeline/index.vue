<template>
  <fs-page class="page-cert">
    <template #header>
      <div class="title">我的流水线</div>
    </template>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <!--        <span style="margin-left: 10px">出现<a-tag>Promise rejected attempt #18,retrying in 10000ms:No TXT recordsfound for name</a-tag>属于正常现象，多重试几次</span>-->
      </template>
      <template #form-bottom>
        <div>
          申请证书
        </div>
      </template>
      <pi-certd-form ref="certdFormRef"></pi-certd-form>
    </fs-crud>
  </fs-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useCrud, useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { useExpose } from "@fast-crud/fast-crud";
import PiCertdForm from "./certd-form/index.vue";
export default defineComponent({
  name: "PipelineManager",
  components: { PiCertdForm },
  setup() {
    const certdFormRef = ref();
    const context: any = {
      certdFormRef
    };
    const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions, context });

    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
      certdFormRef
    };
  }
});
</script>
<style lang="less"></style>
