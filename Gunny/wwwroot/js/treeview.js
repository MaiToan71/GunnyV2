var ViewModal = function () {
    self = this;
    function getGroupModel(data) {
        var items = getNestedGroup(0, data);
        //<remove duplicates, for infinity nesting only>   
        for (var i = 0; i < items.length; i++) {
            if (items[i].used) {
                items.splice(i, 1);
                i--;
            }
        }
        //</remove duplicates, for infinity nesting only>
        //<build root item>
        return items;
    };
    function getNestedGroup(index, all) {
        var root = all[index];
        if (!root) {
            return all;
        }
        if (!all[index].children) {
            all[index].children = [];
        }
        for (var i = 0; i < all.length; i++) {
            //<infinity nesting?>
            //put children inside it's parent
            if (all[index].id == all[i].parentID) {
                all[index].children.push(all[i]);
                all[i].used = true;
            }
            //</infinity nesting?>
        }
        //all[index].order = index;
        return getNestedGroup(++index, all);
    };
    
    self.getUser = function () {
        $.ajax({
            method: "GET",
            url: "/api/user/all",
            contentType: "application/json",
            /*headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },*/
            success: function (data) {
                console.log(data)
                self.loadTreeView(data)
            },
            error: function (err) {
            }
        });

    }

    self.loadTreeView = function (input) {
        var data = [];
        $.each(input, function (idx, item) {
            data.push({ id: item.email, text: item.email, parentID: item.presenter});
        });
        $("#tree_3").jstree("destroy");

        $("#tree_3").jstree({
            // 'plugins': ["wholerow", "checkbox", "types"],
            'core': {
                "themes": {
                    "responsive": false
                },
                'data': getGroupModel(data)
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                },
                "plugins": ["types"]
            },
            expand_selected_onload: true
        });
        $('#tree_3').on('ready.jstree', function () {
            $("#tree_3").jstree("open_all");
        });
        $("#tree_3").on("select_node.jstree",
            function (evt, data) {
          /*      var nodeId = $('#tree_3').jstree().get_selected("id")[0].id;
                var nodeName = $('#tree_3').jstree().get_selected("id")[0].text;
                var parentID = $('#tree_3').jstree().get_selected("id")[0].parent;
                var isShow = $('#tree_3').jstree().get_selected("id")[0].original.isShow
                var isNew = false
                var topMenu = $('#tree_3').jstree().get_selected("id")[0].original.topMenu
                var gr = { Id: nodeId, Name: nodeName, ParentId: parentID, IsShow: isShow, IsNew: isNew, TopMenu: false };

                self.selectedItemClick(gr.Id)
                var content = getById(gr.Id).Note()
                if (getById(gr.Id).Note() == null) {
                    content = ''
                }
                tinymce.get("note").setContent(content);

*/
            }
        );

    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.getUser();
    ko.applyBindings(viewModal);
});