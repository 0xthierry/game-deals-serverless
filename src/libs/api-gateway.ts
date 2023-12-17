export const formatJSONResponse = ({
  data = {},
  statusCode = 200,
}: {
  statusCode?: number;
  data: Record<string, unknown>;
}) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data),
  };
};
