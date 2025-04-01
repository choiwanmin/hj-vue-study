import { defineStore } from 'pinia';
// 과거 vuex를 많이 사용 최근 pinia 많이 사용
export const useModalStore = defineStore('modalState', () => {
    const modalState = ref(false);

    const setModalState = () => {
        modalState.value = !modalState.value;
    };

    return { modalState, setModalState };
});
