let tableItems = (function (g) {
    "use strict";
    let table = {
        selector: null,
        debuggy: false,
        data: [],
        addModalID: 'add-modal',
        addModalContent: '<p>Modal sample text</p>',
        editModalID: 'edit-modal',
        editModalContent: '<p>Modal sample text</p>'
    }
    let publicMethods = {
        draw: () => {
            //@todo how to implement else
            setTimeout(() => {
                table.selector.dispatchEvent(events.tiReadyEvent);
            },10);
            let tableHTML = privateMethods.drawTable();
            let addModal = privateMethods.drawModal(table.addModalID, table.addModalContent)
            let editModal = privateMethods.drawModal(table.editModalID, table.editModalContent)
            return tableHTML + addModal + editModal;
        },
        on: (event, callback, useCapture) => {
            if (!event) throw new Error('Please provide an event to listen for.');
            if (!callback || typeof callback !== 'function') throw new Error('Please provide a valid callback function to run');
            table.selector.addEventListener(event, callback, useCapture || false);
        }
    }

    let privateMethods = {
        drawTable: () => {
            let html = `
            <table>
                <thead>
                    <th>№</th>
                    <th>Название</th>
                    <th>Количество</th>
                    <th colspan="2">
                        <span>Действия</span>
                        <i class="icon icon-plus"></i>
                    </th>
                </thead>
                <tbody>
                    ${privateMethods.drawRows()}
                </tbody>
            </table>`;
            return html;
        },
        drawRows: () => {
            let html = '';
            let data = table.data;
            data.forEach((item, index) => {
                html += `
            <tr class="item">
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.count}</td>
                <td>                    
                    <i class="icon icon-gear"></i>
                    <i class="icon icon-trash"></i>
                </td>
                <td>
                    <i class="icon icon-arrow-up"></i>
                    <i class="icon icon-arrow-down"></i>
                </td>
            </tr>
           `
            });
            return html;
        },
        recalculateIDs: () => {
            table.selector.querySelectorAll(' tbody tr').forEach((element, rowIndex) => {
                let children = element.childNodes
                children.forEach((column, columnIndex) => {
                    //just first one
                    if(columnIndex == 1) {
                        column.innerHTML = rowIndex + 1
                    }
                })
            })
        },
        drawModal: (modalID, modalContent) => {
            let html = `
                <div id="${modalID}" class="modal">
                <!-- Modal content -->
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div>${modalContent}</div>
                </div>
            </div>`;
            return html;
        },
        showModal: (modalID) => {
            let modal = table.selector.querySelector(`#${modalID}`)
            modal.style.display = "block";
        },
        hideModal: (element) => {
            element.style.display = "none";
        }
    }
    let events = {
        tiReadyEvent: new CustomEvent('tableItem.ready'),
        tiClickEvent: new CustomEvent('tableItem.internalclick'),
        init: () => {
            // Подписываемся на событие
            table.selector.addEventListener('tableItem.ready', function (e) {
                if(table.debuggy) {
                    debug.log('tableItem.ready state at library side')
                }
                events.postInit()
            }, false);
            table.selector.addEventListener('tableItem.internalclick', function (e) {
                if(table.debuggy) {
                    debug.log('tableItem.internalclick state at library side')
                }
                publicMethods.on('click', (e) => {
                    let element = e.target
                    if(table.debuggy) {
                        debug.log(element)
                    }
                    if(element.classList.contains('icon-plus')) {
                        if(table.debuggy) {
                            debug.log('Plus sign is in action')
                        }
                        privateMethods.showModal(table.addModalID)
                    }
                    if(element.classList.contains('icon-gear')) {
                        if(table.debuggy) {
                            debug.log('Gear sign is in action')
                        }
                        privateMethods.showModal(table.editModalID)
                    }
                    if(element.classList.contains('icon-trash')) {
                        if(table.debuggy) {
                            debug.log('Trash sign is in action')
                        }
                        element.parentElement.parentElement.remove()
                    }
                    if(element.classList.contains('icon-arrow-up')) {
                        if(table.debuggy) {
                            debug.log('Arrow up sign is in action')
                        }
                        let beingMovedElement = element.parentElement.parentElement
                        let previousSibling = beingMovedElement.previousElementSibling
                        if(previousSibling) {
                            beingMovedElement.remove()
                            previousSibling.insertAdjacentElement('beforeBegin', beingMovedElement)
                        }
                        privateMethods.recalculateIDs()
                    }
                    if(element.classList.contains('icon-arrow-down')) {
                        if(table.debuggy) {
                            debug.log('Arrow down sign is in action')
                        }
                        let beingMovedElement = element.parentElement.parentElement
                        let nextSibling = beingMovedElement.nextElementSibling
                        if(nextSibling) {
                            beingMovedElement.remove()
                            nextSibling.insertAdjacentElement('afterEnd', beingMovedElement)
                        }
                        privateMethods.recalculateIDs()
                    }
                    //modal events
                    if(element.classList.contains('modal')) {
                        if(table.debuggy) {
                            debug.log('Modal is in action')
                        }
                        privateMethods.hideModal(element)
                    }
                    if(element.classList.contains('close')) {
                        if(table.debuggy) {
                            debug.log('Close is in action')
                        }
                        privateMethods.hideModal(element.parentElement.parentElement)
                    }
                })
            }, false);
        },
        postInit: () => {
            table.selector.dispatchEvent(events.tiClickEvent);
        }
    }
    let debug = {
        log: (whatToLog) => {
            console.log('---------------------------------');
            console.log(whatToLog);
            console.log('---------------------------------');
        }
    }

    return ((params) => {
        //init
        Object.assign(table, params);
        //validation
        if(table.selector == null || table.selector == undefined) {
            throw new Error('Selector must be set');
        }
        //events
        events.init()
        //return object
        return publicMethods;
    });
}(this));