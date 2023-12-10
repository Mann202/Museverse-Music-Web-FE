import React from "react";

function TableHeader() {
  return (
    <div className="justify-center min-h-12">
      <h5 className="text-center font-semibold">
        Mô tả đơn hàng
      </h5>
    </div>
  );
}

export default function OrderTable({ data }) {
  return (
    <div className="text-white">
      <div className="mt-10 mb-10">
        <p className="text-center">
          Đơn hàng <b>{data?.id ? `#${data.id}` : "không tìm thấy"}</b>
          {data?.status
            ? data.status == "PAID"
              ? ` đã thanh toán thành công`
              : ` chưa được thanh toán`
            : ""}
        </p>
      </div>
      <div
      className="w-full mb-10 flex justify-center"
      >
        <div>
          <TableHeader />
            <table size="small" className="md:min-w-[700px]">
              <tbody>
                {data ? (
                  <>
                    <tr key={"id"}>
                      <td align="left">
                        <p>Mã đơn hàng</p>
                      </td>
                      <td align="left">
                        <b>#{data["id"]}</b>
                      </td>
                    </tr>
                    <tr key={"status"}>
                      <td align="left">Trạng thái</td>
                      <td align="left">
                        {data["status"] == "PAID"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </td>
                    </tr>
                    <tr key={"amount"}>
                      <td align="left">Tổng tiền</td>
                      <td align="left">{data["amount"]} VNĐ</td>
                    </tr>
                  </>
                ) : (
                  <tr
                    key={0}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <td align="center" colSpan={12}>
                      Không có thông tin đơn hàng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}