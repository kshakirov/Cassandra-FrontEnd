magento_module.service('Pagination', function (PageSize) {
    var default_per_page = PageSize.getPageSize();

    function _calculate_pagination_window_start(current_page) {

        if (current_page >  3) {
            return (current_page - 3)
        } else if(current_page==3)
        {
            return current_page - 3
        }
        else if(current_page==2)
        {
            return current_page - 2
        }
        else if(current_page==1)
        {
            return current_page - 1
        }
    }

    function _calculate_pagination_window_end(pagination_window_start,  window_size,total_pages) {
        if(pagination_window_start  + window_size > total_pages)
            return total_pages
        else
            return pagination_window_start  + window_size
    }


    function _get_pages_to_navigate(total, current_page, per_page) {
        var total_pages = total / per_page;
        var pagination_window_start = _calculate_pagination_window_start(current_page);
        var window_size = 5;
        var pagination_window_end = _calculate_pagination_window_end(pagination_window_start, window_size, total_pages);

        var pages = [];
        for (i = pagination_window_start; i < pagination_window_end; i++) {
            var page = {page: i + 1, items: i * per_page, per_page: per_page}
            pages.push(page);
        }
        return pages;
    }

    var pagination_scope;

    function _goToPage(page) {
        console.log(page);

    }

    function _change_type_of_response(response) {
        if(typeof response=='string'){
            return JSON.parse(response)
        }else
            return response
    }

    this.initialize = function (scope) {
        pagination_scope = scope;
        pagination_scope.total = 0;
        pagination_scope.visible_pages = [];
        pagination_scope.visible_items = [];
        pagination_scope.per_page = PageSize.getPageSize();
        pagination_scope.current_page = 1;
        pagination_scope.goToPage = _goToPage;
    }


    this.render = function (p, page_object) {
        var promise = _change_type_of_response(p);
        pagination_scope.total = promise.hits.total;
        pagination_scope.total_pages = promise.hits.total / pagination_scope.per_page;
        pagination_scope.current_page = 1;
        pagination_scope.per_page = PageSize.getPageSize();
        pagination_scope.visible_items =
            [(pagination_scope.current_page - 1) * pagination_scope.per_page,
                pagination_scope.current_page * pagination_scope.per_page];
        pagination_scope.visible_pages = _get_pages_to_navigate(pagination_scope.total, pagination_scope.current_page, pagination_scope.per_page);

    }

    this.renderUpdated = function (p, page_object) {
        var promise = _change_type_of_response(p);
        pagination_scope.total = promise.hits.total;
        pagination_scope.total_pages = promise.hits.total / pagination_scope.per_page;
        pagination_scope.per_page = PageSize.getPageSize();
        pagination_scope.visible_items =
            [page_object.items, page_object.items + page_object.per_page];
        pagination_scope.current_page = page_object.page;
        pagination_scope.visible_pages = _get_pages_to_navigate(pagination_scope.total, pagination_scope.current_page, pagination_scope.per_page);
    }
    
   

   

})

