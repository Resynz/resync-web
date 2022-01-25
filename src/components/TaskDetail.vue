<template>
  <el-drawer :title="title" :visible.sync="visible" size="80%" :close-on-click-modal="false" :wrapper-closable="false" :before-close="beforeClose" :close-on-press-escape="false">
    <div class="task_detail" v-loading="loading">
      <el-form label-width="80px">
        <el-form-item label="任务描述">
          <el-input type="textarea" v-model="data.note" placeholder="请输入任务描述" show-word-limit maxlength="100" clearable />
        </el-form-item>
        <el-form-item label="仓库类型">
          <el-radio-group v-model="data.source_code_type">
            <el-radio v-for="(item,index) in sourceCodeTypes" :key="index" :label="item.value">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="data.source_code_type === 1">
          <el-form-item label="仓库地址">
            <el-input v-model="data.repository_url" size="small" placeholder="请输入仓库地址" clearable />
          </el-form-item>
          <el-form-item label="源码分支">
            <el-input v-model="data.branch" placeholder="请输入源码分支" size="small" clearable />
          </el-form-item>
          <el-form-item label="身份校验">
            <el-select v-model="data.code_auth_id" size="small" style="width: 120px" placeholder="请选择身份">
              <el-option v-for="item in codeAuthList" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
            <el-button type="success" plain size="mini" style="margin-left: 10px" @click="createCodeAuth">创建</el-button>
          </el-form-item>
        </div>
        <el-form-item label="Actions">
          <div class="action" style="margin-bottom: 10px" v-for="(item,index) in data.action_list" :key="index">
            <el-input type="textarea"  v-model="item.content" placeholder="请输入需要执行的shell命令" />
            <i class="i_remove el-icon-delete" @click="removeAction(index)"/>
          </div>
          <el-button size="mini" class="el-icon-plus" @click="createAction"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="save">
      <el-button type="primary" plain @click="save">保存</el-button>
    </div>
    <!-- 账号弹窗 -->
    <code-auth-dialog ref="codeAuthDialog" @on-success="getCodeAuthList" @on-cancel="getCodeAuthList" />
  </el-drawer>
</template>

<script>
import {ApiEnums} from "../configs/api";
import CodeAuthDialog from "./dialog/CodeAuthDialog";
export default {
  name: "TaskDetail",
  components: {
    CodeAuthDialog
  },
  data () {
    return {
      sourceCodeTypes: [
        {
          name: '无',
          value: 0,
        },
        {
          name: 'Git',
          value: 1,
        }
      ],
      data: {
        id: 0,
        note: '',
        source_code_type: 0,
        repository_url: '',
        branch: '',
        code_auth_id: 0,
        action_list: []
      },
      codeAuthList: [
        {id: 0,name: '无'}
      ],
      title: '',
      visible: false,
      loading: false,
    }
  },
  methods: {
    beforeClose () {
      this.data = {
        id: 0,
        note: '',
        source_code_type: 0,
        repository_url: '',
        branch: '',
        code_auth_id: 0,
        action_list: []
      }
      this.visible = false;
    },
    async getTaskDetail () {
      const res = await this.$networkHandler.sendRequest(ApiEnums.GetTaskInfo,{id: this.data.id},null,'loading',this);
      if (res.detail) {
        this.data.branch = res.detail.branch;
        this.data.note = res.detail.note;
        this.data.repository_url = res.detail.repository_url;
        this.data.code_auth_id = res.detail.code_auth_id;
        this.data.source_code_type = res.detail.source_code_type;
      }
      if (res.action_list) {
        this.data.action_list = res.action_list || [];
      }
    },
    open (title,taskId) {
      this.title = title
      this.data.id = taskId
      this.getTaskDetail();
      this.getCodeAuthList();
      this.visible = true;
    },
    async getCodeAuthList () {
      this.codeAuthList = [{id: 0,name: '无'}];
      const res = await this.$networkHandler.sendRequest(ApiEnums.GetCodeAuthList,{auth_type:1});
      if (res && res.list) {
        res.list = res.list.map(v=>{
          return {
            id: v.id,
            name: `${v.user_name}/${v.password}`
          }
        })
        this.codeAuthList.push(...res.list);
      }
    },
    createCodeAuth () {
      this.$refs.codeAuthDialog.open("创建账号");
    },
    createAction () {
      this.data.action_list.push({
        type: 1,
        content: '',
        task_id: this.data.id,
      });
    },
    removeAction (index) {
      this.data.action_list.splice(index,1)
    },
    async save () {
      const param = Object.assign({},this.data);
      const res = await this.$networkHandler.sendRequest(ApiEnums.UpdateTask,param,null,'loading',this);
      if (res && res.result) {
        this.$message.success('保存成功');
        this.$emit('on-save');
        this.beforeClose();
      }
    }
  }
}
</script>

<style scoped>
.task_detail {
  margin: 20px;
}
.action {
  display: flex;
  margin-top: 10px;
}
.i_remove {
  color: #F56C6C;
}
.i_remove:hover{
  cursor: pointer;
}
.save {
  position: absolute;
  bottom: 20px;
  right: 10px;
}
</style>
