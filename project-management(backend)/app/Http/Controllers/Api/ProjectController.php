<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectDetailResource;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\ProjectDetail;
use App\Models\ProjectName;
use Haruncpi\LaravelIdGenerator\IdGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;




class ProjectController extends Controller
{
    public $counter;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $project = Project::with('projectDetails.projectName')->when(request()->q, function ($project) {
            $project = $project->where('name', 'like', '%' . request()->q . '%');
        })->orderBy('number')->paginate(10);

        //ProjectDetail::whereRaw('project_id = "107" AND project_name_id = 7')->value('id');

        //return with Api Resource
        return new ProjectResource(true, 'List Data Project Detail', $project);
    }

    public function searchBy($status, $number, $startDate, $endDate)
    {
        if ($status != -1) {
            $projects = Project::with('projectDetails.projectName')
                ->whereRaw('number LIKE "%' . $number . '%" AND DATE_FORMAT(projects.created_at, "%Y-%m-%d") BETWEEN "' . $startDate . '" AND "' . $endDate . '" AND status = ' . $status)
                ->orderBy('number')
                ->paginate(10);
        } else {
            $projects = Project::with('projectDetails.projectName')
                ->whereRaw('number LIKE "%' . $number . '%" AND DATE_FORMAT(projects.created_at, "%Y-%m-%d") BETWEEN "' . $startDate . '" AND "' . $endDate . '"')
                ->orderBy('number')
                ->paginate(10);
        }
        //return with Api Resource
        return new ProjectResource(true, 'List Data Project Detail', $projects);
    }

    public function searchByName($name)
    {
        $projects = Project::with('projectDetails.projectName')
            ->whereRaw('project_name = "' . $name . '"')
            ->first();
        //return with Api Resource
        return new ProjectResource(true, 'List Data Project Detail', $projects);
    }



    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, ProjectDetail $projectDetail)
    {
        $last_project = Project::orderBy('id', 'desc')->first();
        $last_sequence = ProjectDetail::orderBy('id', 'desc')->first()->sequence ?? 0;
        $sequence = str_pad($last_sequence + 1, $last_sequence);




        if ($last_project != null) {
            if ($request->project_name == $last_project->project_name) {

                $selected_projectDetail_id = ProjectDetail::whereRaw('project_id = "' . $last_project->id . '" AND project_name_id = "' . $request->project_name_id . '"')->value('id');
                if ($selected_projectDetail_id != null) {
                    $update_sequence = ProjectDetail::whereId($selected_projectDetail_id)->first()->sequence;
                    $validator = Validator::make($request->all(), [

                        'project_name'     => 'required',
                        'status'     => 'required|integer',
                        'note' => 'required',
                        'project_name_id'   => 'required',
                        'project_status'   => 'required',
                        'document_attch'   => 'required',
                        'project_note'   => 'required',
                    ]);

                    if ($validator->fails()) {

                        return response()->json($validator->errors(), 422);
                    }

                    if ($request->hasFile('document_attch')) {
                        $filenameWithExt = $request->file('document_attch')->getClientOriginalName();
                        $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
                        $extension = $request->file('document_attch')->getClientOriginalExtension();
                        $filenameSimpan = $filename . '_' . time() . '.' . $extension;

                        $document_attch = $request->file('document_attch');
                        $document_attch->storeAs('public/document', $filenameSimpan);

                        ProjectDetail::whereId($selected_projectDetail_id)
                            ->update([
                                'project_id'   => $last_project->id,
                                'project_name_id'   => $request->project_name_id,
                                'sequence'   => $update_sequence,
                                'project_status'   => $request->project_status,
                                'document_attch'   => $filenameSimpan,
                                'project_note'   => $request->project_note,
                            ]);
                    } else {
                        ProjectDetail::whereId($selected_projectDetail_id)
                            ->update([
                                'project_id'   => $last_project->id,
                                'project_name_id'   => $request->project_name_id,
                                'sequence'   => $update_sequence,
                                'project_status'   => $request->project_status,
                                'document_attch'   => "-",
                                'project_note'   => $request->project_note,
                            ]);
                    }

                    if ($projectDetail) {
                        return new ProjectDetailResource(true, "Data Project Detail Berhasil di update",null);
                    } else {
                        return new ProjectDetailResource(true, "Data Project Detail gagal di update", null);
                    }
                } else {
                    $validator = Validator::make($request->all(), [

                        'project_name'     => 'required',
                        'status'     => 'required|integer',
                        'note' => 'required',
                        'project_name_id'   => 'required',
                        'project_status'   => 'required',
                        'document_attch'   => 'required',
                        'project_note'   => 'required',
                    ]);

                    if ($validator->fails()) {

                        return response()->json($validator->errors(), 422);
                    }



                    if ($request->hasFile('document_attch')) {
                        $filenameWithExt = $request->file('document_attch')->getClientOriginalName();
                        $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
                        $extension = $request->file('document_attch')->getClientOriginalExtension();
                        $filenameSimpan = $filename . '_' . time() . '.' . $extension;

                        $document_attch = $request->file('document_attch');
                        $document_attch->storeAs('public/document', $filenameSimpan);

                        $projectDetail = ProjectDetail::create([

                            'project_id'   => $last_project->id,
                            'project_name_id'   => $request->project_name_id,
                            'sequence'   => $sequence,
                            'project_status'   => $request->project_status,
                            'document_attch'   => $filenameSimpan,
                            'project_note'   => $request->project_note,

                        ]);
                    } else {
                        $projectDetail = ProjectDetail::create([

                            'project_id'   => $last_project->id,
                            'project_name_id'   => $request->project_name_id,
                            'sequence'   => $sequence,
                            'project_status'   => $request->project_status,
                            'document_attch'   => "-",
                            'project_note'   => $request->project_note,

                        ]);
                    }

                    if ($projectDetail) {
                        return new ProjectDetailResource(true, "Data Project Detail Berhasil di simpan", $projectDetail);
                    } else {
                        return new ProjectDetailResource(true, "Data Project Detail gagal di simpan", null);
                    }
                }
            }
        }

        $validator = Validator::make($request->all(), [

            'project_name'     => 'required|unique:projects',
            'status'     => 'required|integer',
            'note' => 'required',
            'project_name_id'   => 'required',
            'project_status'   => 'required',
            'document_attch'   => 'required',
            'project_note'   => 'required',
        ]);



        if ($validator->fails()) {

            return response()->json($validator->errors(), 422);
        }

        $last_sequence = ProjectDetail::orderBy('id', 'desc')->first()->sequence ?? 0;
        $number = IdGenerator::generate(['table' => 'projects', 'field' => 'number', 'length' => 14, 'prefix' => 'PRJ-' . date("ym") . "-"]);
        $projectName = ProjectName::pluck('id');
        $sequence = str_pad($last_sequence + 1, $last_sequence);

        //create project
        $project = Project::create([

            'number' => $number,

            'project_name' => $request->project_name,

            'status' => $request->status,

            'note' => $request->note,

            'prefix_number' => 'PRJ/' . date("ym"),

        ]);


        $project_id = $project->id;
        if ($request->hasFile('document_attch')) {
            $filenameWithExt = $request->file('document_attch')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('document_attch')->getClientOriginalExtension();
            $filenameSimpan = $filename . '_' . time() . '.' . $extension;

            $document_attch = $request->file('document_attch');
            $document_attch->storeAs('public/document', $filenameSimpan);

            $projectDetail = ProjectDetail::create([

                'project_id'   => $project_id,
                'project_name_id'   => $request->project_name_id,
                'sequence'   => $sequence,
                'project_status'   => $request->project_status,
                'document_attch'   => $filenameSimpan,
                'project_note'   => $request->project_note,

            ]);
        } else {
            $projectDetail = ProjectDetail::create([

                'project_id'   => $project_id,
                'project_name_id'   => $request->project_name_id,
                'sequence'   => $sequence,
                'project_status'   => $request->project_status,
                'document_attch'   => "-",
                'project_note'   => $request->project_note,

            ]);
        }

        // foreach ($projectName as $value) {
        //     $sequence++;
        //     if ($value == $request->project_name_id) {

        //         if ($request->hasFile('document_attch')) {
        //             $filenameWithExt = $request->file('document_attch')->getClientOriginalName();
        //             $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
        //             $extension = $request->file('document_attch')->getClientOriginalExtension();
        //             $filenameSimpan = $filename . '_' . time() . '.' . $extension;

        //             $document_attch = $request->file('document_attch');
        //             $document_attch->storeAs('public/document', $filenameSimpan);

        //             $projectDetail = ProjectDetail::create([

        //                 'project_id'   => $project_id,
        //                 'project_name_id'   => $request->project_name_id,
        //                 'sequence'   => $sequence,
        //                 'project_status'   => $request->project_status,
        //                 'document_attch'   => $filenameSimpan,
        //                 'project_note'   => $request->note,

        //             ]);
        //         } else {
        //             $projectDetail = ProjectDetail::create([

        //                 'project_id'   => $project_id,
        //                 'project_name_id'   => $request->project_name_id,
        //                 'sequence'   => $sequence,
        //                 'project_status'   => $request->project_status,
        //                 'document_attch'   => "-",
        //                 'project_note'   => $request->note,

        //             ]);
        //         }
        //     } else {
        //         if ($request->hasFile('document_attch')) {
        //             $filenameWithExt = $request->file('document_attch')->getClientOriginalName();
        //             $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
        //             $extension = $request->file('document_attch')->getClientOriginalExtension();
        //             $filenameSimpan = $filename . '_' . time() . '.' . $extension;

        //             $document_attch = $request->file('document_attch');
        //             $document_attch->storeAs('public/document', $filenameSimpan);

        //             $projectDetail = ProjectDetail::create([

        //                 'project_id'   => $project_id,
        //                 'project_name_id'   => $value,
        //                 'sequence'   => $sequence,
        //                 'project_status'   => "-",
        //                 'document_attch'   => "-",
        //                 'project_note'   => "-",

        //             ]);
        //         } else {
        //             $projectDetail = ProjectDetail::create([

        //                 'project_id'   => $project_id,
        //                 'project_name_id'   => $value,
        //                 'sequence'   => $sequence,
        //                 'project_status'   => "-",
        //                 'document_attch'   => "-",
        //                 'project_note'   => "-",

        //             ]);
        //         }
        //     }
        // }

        if ($projectDetail) {
            if ($project) {
                return new ProjectResource(true, 'Data Project Berhasil Disimpan!', $project);
            } else {
                return new ProjectResource(false, 'Data Project gagal Disimpan!', null);
            }
        } else {
            return new ProjectResource(true, 'Data Project Berhasil Disimpan!', $project);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        $project = Project::with('projectDetails')->whereId($id)->first();

        if ($project) {
            return new ProjectResource(true, 'Detail data Project ', $project);
        }

        return new ProjectResource(true, 'Detail data Project tidak ditemukan', null);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */



    public function update(Request $request, Project $project)
    {
        $validator = Validator::make($request->all(), [
            'project_name'     => 'required|unique:projects,project_name,' . $project->id,
            'status'     => 'required|integer',
            'note'     => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $number = Project::whereId($project->id)->first()->number;
        //update project withour image
        $project->update([
            'number' => $number,

            'project_name' => $request->project_name,

            'status' => $request->status,

            'note' => $request->note,

            'prefix_number' => 'PRJ/' . date("ym"),

        ]);

        if ($project) {
            return new ProjectResource(true, 'Data project berhasil di update', $project); # code...
        }

        return new ProjectResource(false, 'Data project gagal di update', null);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Project $project)
    {
        if ($project->delete()) {
            // $current_number = Project::whereId($project->id)->first()->number;
            // $min_number = Project::orderBy($project->id)->first()->number;
            // if($current_number > $min_number){

            // }


            return new ProjectResource(true, 'Data project berhasil di hapus', null);
        }

        return new ProjectResource(false, 'Data project gagal di hapus', null);
    }
}
