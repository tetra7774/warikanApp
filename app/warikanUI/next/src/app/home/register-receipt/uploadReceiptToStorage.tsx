

import * as common from "oci-common";
import * as os from "oci-objectstorage";

const uploadReceiptToStorage = async (imageUint8Array: Uint8Array, destFileName: string) => {

    const authenticationProvider = await new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();
    const client = new os.ObjectStorageClient({ authenticationDetailsProvider: authenticationProvider });
    client.regionId = "ap-osaka-1";

    console.log("Getting the namespace...");
    const request: os.requests.GetNamespaceRequest = {};
    const response = await client.getNamespace(request);
    const namespace = response.value;

    console.log("Bucket is created. Now adding object to the Bucket.");
    const putObjectRequest: os.requests.PutObjectRequest = {
        namespaceName: namespace,
        bucketName: "receipt-image-storage",
        putObjectBody: imageUint8Array,
        objectName: destFileName,
        contentLength: imageUint8Array.length
    };

    try {
        const putObjectResponse = await client.putObject(putObjectRequest);
        console.log("Put Object executed successfully" + putObjectResponse);
    } catch (error) {
        console.error('Error getting bucket:', error);
        return { message: error, status: 400 };
    }

    return { message: "OK", status: 200 };
}


export default uploadReceiptToStorage;

