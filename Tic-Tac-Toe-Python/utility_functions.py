from typing import List, Any


def check_all_elements_are_same(input_list: List[Any], element: Any):
    list_set = set(input_list)
    if len(list_set) == 1 and element in list_set:
        return True
    return False
