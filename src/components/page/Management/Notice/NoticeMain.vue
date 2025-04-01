<script setup>
import axios from 'axios';
import { watch } from 'vue';
import { useModalStore } from '../../../../stores/modalState';
import Pagination from '../../../common/Pagination.vue';

const route = useRoute();
// 초기값 없음-null
const noticeList = ref();
const flag = ref(false);
// 객체 뭐시기
// 모달 컴포넌트와 같은 값을 참조하고 있음
const modalState = useModalStore();
const noticeId = ref(0);
// console.log(modalState);
// 객체 분할 구조로 한다면
// const { modalState, setModalState } = useModalStore();

const cPage = ref(1);

const searchList = () => {
    const param = new URLSearchParams({
        ...route.query,
        pageSize: 5,
        // currentPage: 1,
        currentPage: cPage.value,
    });

    // 기존 응답이 아닌 json 형식으로 응답을 받고 싶음
    // axios.post('/api/management/noticeList.do', param);
    axios.post('/api/management/noticeListBody.do', param).then(res => {
        // console.log(res);
        noticeList.value = res.data;
    });
};

const handlerModal = id => {
    noticeId.value = id;
    modalState.setModalState();
};

const test = val => {
    // 양방향 데이터 처리의 예시
    console.log(val);
};

const onPostSuccess = () => {
    modalState.setModalState();
    searchList();
};

onMounted(() => {
    // console.log(route);
    // console.log(route.query);
    searchList();
});

// 첫번째 인자 데이터, 두번째 인자 콜백함수-호출할 필요 없 watch에서 실행해줌
// 첫번째 인자는 ref처럼 반응형 상태값이 들어가야함
// watch(route, searchList);
// route.query 반응형 데이터가 아님, 반응형 데이터가 들어가야 watch가 실행됨
// watch(route.query, searchList);
watch(() => route.query, searchList);
watch(noticeId, () => {
    console.log(noticeId.value);
});
</script>
<template>
    <div class="divNoticeList">
        <!-- <NoticeModal v-if="flag" /> -->
        <!-- <NoticeModal v-if="modalState.modalState" v-bind:id="noticeId" /> v-bind 이 또한 프롭스-->
        <!-- <NoticeModal v-if="modalState.modalState" :id="noticeId" /> -->
        <!-- @modalClose="() => (noticeId = 0)" -->
        <!-- @modalClose="test($event)" -->
        <NoticeModal
            v-if="modalState.modalState"
            :id="noticeId"
            @modalClose="noticeId = $event"
            @postSuccess="onPostSuccess"
        />
        <!-- ?-es6에서 사용, 조건문과 비슷한 역할 -->
        현재 페이지: 총 개수: {{ noticeList?.noticeCnt }}
        <table>
            <colgroup>
                <col width="10%" />
                <col width="50%" />
                <col width="30%" />
                <col width="10%" />
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">번호</th>
                    <th scope="col">제목</th>
                    <th scope="col">작성일</th>
                    <th scope="col">작성자</th>
                </tr>
            </thead>
            <tbody>
                <!-- template은 빈 태그 의미가 있지는 않음 div는 속성을 사용을 해야하기에 이거를 사용 -->
                <template v-if="noticeList">
                    <template v-if="noticeList.noticeCnt > 0">
                        <!-- key="notice" 리스트 중 하나를 가져 옴 -->
                        <!-- @click="flag = !flag" -->
                        <tr
                            v-for="notice in noticeList.noticeList"
                            :key="notice.noticeId"
                            @click="handlerModal(notice.noticeId)"
                        >
                            <td>{{ notice.noticeId }}</td>
                            <td>{{ notice.title }}</td>
                            <td>{{ notice.createdDate.substr(0, 10) }}</td>
                            <td>{{ notice.author }}</td>
                        </tr>
                    </template>
                    <!-- 가독성을 위해 template 태그를 추가하여 검색 결과 없을 때 내용을 표시 -->
                    <template v-else>
                        <tr>
                            <td colspan="4">일치하는 검색 결과가 없습니다</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
        <Pagination
            :totalItems="noticeList?.noticeCnt"
            :itemsPerPage="5"
            :maxPagesShown="5"
            :onClick="searchList"
            v-model="cPage"
        />
    </div>
</template>

<script setup></script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0px 0px 0px;
    font-size: 18px;
    text-align: left;

    th,
    td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        text-align: center;
    }

    th {
        background-color: #2676bf;
        color: #ddd;
    }

    /* 테이블 올렸을 때 */
    tbody tr:hover {
        background-color: #d3d3d3;
        opacity: 0.9;
        cursor: pointer;
    }
}
</style>
