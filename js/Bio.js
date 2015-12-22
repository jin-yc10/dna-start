/**
 * Created by jin-yc10 on 15/12/10.
 */

var Bio = function(editor) {
    var signals = editor.signals;
    var strands = {};
    return {
        // link two strands
        link: function(end3, end5) {
            if(!end3.userData['end5'] && !end5.userData['end3']) {
                // create a red line to represent link between two strand
                end3.userData['end5'] = {};
                end5.userData['end3'] = {};
                end3.userData['end5'].uuid = end5.uuid;
                end5.userData['end3'].uuid = end3.uuid;
                var lineMaterial = new THREE.LineBasicMaterial({color: 0xff7777,linewidth: 1});
                var lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(
                    end3.userData['End5Box'].getWorldPosition(),
                    end5.userData['End3Box'].getWorldPosition());
                var linkObj = new THREE.Line(lineGeometry, lineMaterial);
                linkObj.userData.type = "link";
                linkObj.userData.cant_pick = true;
                end3.userData['end5'].linkObj = linkObj;
                end5.userData['end3'].linkObj = linkObj;
                editor.addObject(linkObj);
                return true;
            } else {
                return false;
            }
        },
        match: function(a, b) {

        },
        createStrand: function(name) {
            var group = new THREE.Object3D();
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            var End3 = new THREE.Mesh( geometry, material );
            End3.translateOnAxis(new THREE.Vector3(0,0,1), 10);
            End3.parent = group;

            var End5 = new THREE.Mesh( geometry, material );
            End5.translateOnAxis(new THREE.Vector3(-0,-0,-1), 10);

            var lineMaterial = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                linewidth: 3
            });
            var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(
                new THREE.Vector3(0,0,10),
                new THREE.Vector3(-0,-0,-10)
            );
            var Strand = new THREE.Line(lineGeometry, lineMaterial);
            group.add(End3);
            group.add(End5);
            group.add(Strand);
            group.userData.type = "Strand";
            group.userData['End3Box'] = End3;
            group.userData['End5Box'] = End5;
            group.userData['match'] = undefined;
            End3.userData.pick_parent = true;
            End5.userData.pick_parent = true;
            Strand.userData.pick_parent = true;
            if( !name ) {
                // if not specify a name, use uuid
            }
            return group;
        }
    }
};