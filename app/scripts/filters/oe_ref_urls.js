magento_module.filter('or_ref_urls_filter', function ($cookies, $filter) {


  function create_array_of_urls(urls) {
    return urls.map(
      function (url) {
        return '<a  href="#/part/sku/' + url.sku + '">' + url.part_number + '</a>'
      })
  }


  function or_ref_urls_filter(input) {
    var html = "";
    if (input) {
      if (typeof input == 'object' && input.length > 0) {
        html = create_array_of_urls(input).join(", ");
      } else {
        html = '<a  href="#/part/sku/' + input.sku + '">' + input.part_number + '</a>'
      }
    }
    return html
  };
  or_ref_urls_filter.$stateful = true;
  return or_ref_urls_filter;
});


